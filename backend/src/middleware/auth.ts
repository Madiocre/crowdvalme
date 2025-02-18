import { Response, NextFunction, RequestHandler } from 'express';
import { adminAuth, adminDb } from '../config/firebaseAdmin';
import { getSession } from '../utils/redis';
import { AuthenticatedRequest, User } from '../types';
import { Timestamp } from 'firebase-admin/firestore';

export const verifyToken = (async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) throw new Error('No token provided');
    
    // 1. Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // 2. Validate session in Redis
    const sessionToken = await getSession(decodedToken.uid);
    if (sessionToken !== token) throw new Error('Invalid session');

    // 3. Get complete user data from Firestore
    const userDoc = await adminDb.doc(`users/${decodedToken.uid}`).get();
    if (!userDoc.exists) throw new Error('User not found');

    // 4. Convert Firestore data to User type
    const userData = userDoc.data() as User;
    const user: User = {
      uid: decodedToken.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      tokens: userData.tokens,
      lastTokenRefill: (userData.lastTokenRefill as Timestamp),
      createdAt: (userData.createdAt as Timestamp),
      updatedAt: (userData.updatedAt as Timestamp),
      ideasSubmitted: userData.ideasSubmitted,
      totalVotesCast: userData.totalVotesCast,
      votesReceivedOnIdeas: userData.votesReceivedOnIdeas
    };

    // 5. Attach complete user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}) as RequestHandler; 
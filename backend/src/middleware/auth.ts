import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebaseAdmin';

interface CustomRequest extends Request {
  user?: {
    uid: string;
  };
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
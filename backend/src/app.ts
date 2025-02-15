import express, { Request, Response } from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/auth';
import dotenv from 'dotenv';
import { adminDb } from './config/firebaseAdmin';
import { Idea, User, Vote, IdeaStatus } from './types';
import { TokenManager } from './utils/tokenManager';
import { FieldValue } from 'firebase-admin/firestore';

interface CustomRequest extends Request {
  user?: {
    uid: string;
  };
}

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Get user profile
app.get('/api/user', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const userDoc = await adminDb.doc(`users/${req.user.uid}`).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Refresh tokens if needed
    await TokenManager.refreshUserTokens(req.user.uid);
    
    // Get updated user data
    const updatedUserDoc = await adminDb.doc(`users/${req.user.uid}`).get();
    res.json(updatedUserDoc.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit new idea
app.post('/api/ideas', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { title, description, category, tags } = req.body;
    
    const newIdea: Idea = {
      id: adminDb.collection('ideas').doc().id,
      creatorId: req.user.uid,
      title,
      description,
      category,
      tags,
      status: IdeaStatus.ACTIVE,
      totalVotes: 0,
      weeklyVotes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await adminDb.doc(`ideas/${newIdea.id}`).set(newIdea);
    
    // Update user's ideas count using FieldValue
    await adminDb.doc(`users/${req.user.uid}`).update({
      ideasSubmitted: FieldValue.increment(1)
    });

    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote for an idea
app.post('/api/ideas/:ideaId/vote', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { ideaId } = req.params;
    const userId = req.user.uid;
    
    // Check if user has tokens
    const canVote = await TokenManager.useToken(userId);
    if (!canVote) {
      res.status(400).json({ error: 'No tokens available' });
      return;
    }

    const now = new Date();
    const weekNumber = getISOWeek(now);
    const year = now.getFullYear();

    // Check if user already voted this week
    const existingVote = await adminDb
      .collection('votes')
      .where('userId', '==', userId)
      .where('ideaId', '==', ideaId)
      .where('weekNumber', '==', weekNumber)
      .where('year', '==', year)
      .get();

    if (!existingVote.empty) {
      res.status(400).json({ error: 'Already voted this week' });
      return;
    }

    // Create vote record
    const voteId = adminDb.collection('votes').doc().id;
    const vote: Vote = {
      id: voteId,
      userId,
      ideaId,
      weekNumber,
      year,
      createdAt: now
    };

    await adminDb.doc(`votes/${voteId}`).set(vote);

    // Update idea vote counts using FieldValue
    await adminDb.doc(`ideas/${ideaId}`).update({
      totalVotes: FieldValue.increment(1),
      weeklyVotes: FieldValue.increment(1)
    });

    res.json({ success: true, remainingTokens: await TokenManager.refreshUserTokens(userId) });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to get ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
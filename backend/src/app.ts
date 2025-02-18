import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { verifyToken } from "./middleware/auth";
import dotenv from "dotenv";
import { adminDb } from "./config/firebaseAdmin";
import { TokenManager } from "./utils/tokenManager";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminAuth } from "./config/firebaseAdmin";
import { setSession, deleteSession } from "./utils/redis";
import {
  AuthenticatedRequest,
  IdeaRequest,
  VoteRequest,
  Idea,
  User,
  IdeaCategory,
  IdeaStatus,
  Vote,
} from "./types";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// For authenticated routes
const authHandler = (
  handler: (req: AuthenticatedRequest, res: Response, next?: NextFunction) => Promise<void>
) => {
  return handler as (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

// For idea routes
const ideaHandler = (
  handler: (req: IdeaRequest, res: Response, next?: NextFunction) => Promise<void>
) => {
  return handler as (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

// For vote routes
const voteHandler = (
  handler: (req: VoteRequest, res: Response, next?: NextFunction) => Promise<void>
) => {
  return handler as (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Store session in Redis
    await setSession(decodedToken.uid, idToken);

    res.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Sign Up API
app.post('/api/auth/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, displayName, photoURL } = req.body;

    // Validate input
    if (!email || !password || !displayName) {
      res.status(400).json({ error: 'Email, password, and display name are required' });
      return;
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      photoURL: photoURL || `https://i.pravatar.cc/150?u=${email}`,
    });

    // Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      photoURL: userRecord.photoURL,
      tokens: 10,
      lastTokenRefill: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ideasSubmitted: 0,
      totalVotesCast: 0,
      votesReceivedOnIdeas: 0,
    });

    // Generate a token for the new user
    const token = await adminAuth.createCustomToken(userRecord.uid);

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      token,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Logout endpoint
app.post(
  "/api/auth/logout",
  verifyToken,
  authHandler(async (req, res) => {
    try {
      await deleteSession(req.user.uid);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to logout" });
    }
  })
);

// Get user profile
app.get(
  "/api/user",
  verifyToken,
  authHandler(async (req, res) => {
    try {
      const userDoc = await adminDb.doc(`users/${req.user.uid}`).get();
      const userData = userDoc.data() as User;
      const response = {
        ...userData,
        createdAt: userData.createdAt.toDate(),
        lastTokenRefill: userData.lastTokenRefill.toDate(),
      };
      res.json(response);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  })
);

// Update user profile
app.put(
  "/api/user",
  verifyToken,
  authHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { displayName, email, photoURL } = req.body;
      const userId = req.user.uid;
      
      // Validate input
      if (!displayName && !email && !photoURL) {
        res.status(400).json({ error: "No valid fields to update" });
        return;
      }
      
      // Only update fields that were provided
      const updateData: Partial<User> = {
        updatedAt: Timestamp.now()
      };
      
      if (displayName) updateData.displayName = displayName;
      if (email) updateData.email = email;
      if (photoURL) updateData.photoURL = photoURL;
      
      // Update Firestore user document
      await adminDb.doc(`users/${userId}`).update(updateData);
      
      // If email is being updated, update Auth record too
      if (email) {
        await adminAuth.updateUser(userId, { email });
      }
      
      // Get updated user data
      const userDoc = await adminDb.doc(`users/${userId}`).get();
      const userData = userDoc.data() as User;
      
      const response = {
        ...userData,
        createdAt: userData.createdAt.toDate(), // Convert Timestamp to Date
        lastTokenRefill: userData.lastTokenRefill.toDate(), // Convert Timestamp to Date
        updatedAt: userData.updatedAt.toDate() // Convert the updated timestamp
      };
      
      res.json(response);
    } catch (error: any) {
      console.error("Error updating user:", error);
      
      // Handle specific error cases
      if (error.code === 'auth/email-already-exists') {
        res.status(400).json({ error: "Email already in use" });
        return;
      }
      
      res.status(500).json({ error: "Server error" });
    }
  })
);

// Submit new idea
app.post(
  '/api/ideas',
  verifyToken,
  ideaHandler(async (req, res) => {
    try {
      const newIdea: Idea = {
        ...req.body,
        id: adminDb.collection('ideas').doc().id,
        creatorId: req.user.uid,
        status: IdeaStatus.ACTIVE,
        totalVotes: 0,
        weeklyVotes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        commentCount: 0,
        imageUrl: ''
      };
      await adminDb.doc(`ideas/${newIdea.id}`).set(newIdea);
      res.status(201).json(newIdea);
    } catch (error) {
      console.error('Error creating idea:', error);
      res.status(500).json({ error: 'Server error' });
    }
  })
);

app.get(
  "/api/ideas",
  verifyToken,
  ideaHandler(async (req, res) => {
    try {
      const ideasSnapshot = await adminDb.collection("ideas").get();
      const ideas = ideasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ error: "Server error" });
    }
  })
);

// Vote for an idea
app.post(
  "/api/ideas/:ideaId/vote",
  verifyToken,
  voteHandler(async (req, res) => {
    try {
      const { ideaId } = req.params;
      const userId = req.user.uid;

      const canVote = await TokenManager.useToken(userId);
      if (!canVote) {
        res.status(400).json({ error: "No tokens available" });
        return;
      }

      const now = new Date();
      const weekNumber = getISOWeek(now);
      const year = now.getFullYear();

      const existingVote = await adminDb
        .collection("votes")
        .where("userId", "==", userId)
        .where("ideaId", "==", ideaId)
        .where("weekNumber", "==", weekNumber)
        .where("year", "==", year)
        .get();

      if (!existingVote.empty) {
        res.status(400).json({ error: "Already voted this week" });
        return;
      }

      const voteId = adminDb.collection("votes").doc().id;
      const vote: Vote = {
        id: voteId,
        userId,
        ideaId,
        weekNumber,
        year,
        createdAt: Timestamp.now(),
      };

      await adminDb.doc(`votes/${voteId}`).set(vote);
      await adminDb.doc(`ideas/${ideaId}`).update({
        totalVotes: FieldValue.increment(1),
        weeklyVotes: FieldValue.increment(1),
      });

      res.json({
        success: true,
        remainingTokens: await TokenManager.refreshUserTokens(userId),
      });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ error: "Server error" });
    }
  })
);

// Helper function to get ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

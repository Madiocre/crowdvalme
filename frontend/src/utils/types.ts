import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string;
  displayName: string;
  email: string;
  tokens: number;
  createdAt: Timestamp;
  lastTokenRefill: Timestamp;
}

export interface Idea {
  ideaId: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  createdAt: Timestamp;
  expiresAt: Timestamp;
  voteCount: number;
  commentCount?: number;
}

// index.ts - Update your types
import { Request } from "express";
import { firestore } from "firebase-admin";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface IdeaRequest extends AuthenticatedRequest {
  body: Omit<Idea, "id" | "creatorId" | "createdAt" | "updatedAt" | "status">;
}

export interface VoteRequest extends AuthenticatedRequest {
  params: {
    ideaId: string;
  };
  body: {
    voteValue: number;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  tokens: number;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  lastTokenRefill: firestore.Timestamp;

  ideasSubmitted: number;
  totalVotesCast: number;
  votesReceivedOnIdeas: number;
}

// Idea related types
export interface Idea {
  commentCount: number;
  imageUrl: string;
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  status: IdeaStatus;
  totalVotes: number;
  weeklyVotes: number;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export interface Vote {
  id: string;
  userId: string;
  ideaId: string;
  weekNumber: number; // ISO week number
  year: number;
  createdAt: firestore.Timestamp;
}

export enum IdeaCategory {
  TECHNOLOGY = "technology",
  BUSINESS = "business",
  SOCIAL = "social",
  ENVIRONMENT = "environment",
  EDUCATION = "education",
  HEALTH = "health",
  OTHER = "other",
}

export enum IdeaStatus {
  ACTIVE = "active",
  TRENDING = "trending",
  VALIDATED = "validated",
  ARCHIVED = "archived",
}

// For Firestore documents
export interface UserDocument
  extends Omit<User, "createdAt" | "updatedAt" | "lastTokenRefill"> {
  createdAt: string;
  updatedAt: string;
  lastTokenRefill: string;
}

export interface IdeaDocument extends Omit<Idea, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface VoteDocument extends Omit<Vote, "createdAt"> {
  createdAt: string;
}

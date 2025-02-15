// User related types
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    tokens: number;
    lastTokenRefill: Date;
    createdAt: Date;
    updatedAt: Date;
    // Stats
    ideasSubmitted: number;
    totalVotesCast: number;
    votesReceivedOnIdeas: number;
  }
  
  // Idea related types
  export interface Idea {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    category: IdeaCategory;
    tags: string[];
    status: IdeaStatus;
    totalVotes: number;
    weeklyVotes: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Vote {
    id: string;
    userId: string;
    ideaId: string;
    weekNumber: number; // ISO week number
    year: number;
    createdAt: Date;
  }
  
  export enum IdeaCategory {
    TECHNOLOGY = 'technology',
    BUSINESS = 'business',
    SOCIAL = 'social',
    ENVIRONMENT = 'environment',
    EDUCATION = 'education',
    HEALTH = 'health',
    OTHER = 'other'
  }
  
  export enum IdeaStatus {
    ACTIVE = 'active',
    TRENDING = 'trending',
    VALIDATED = 'validated',
    ARCHIVED = 'archived'
  }
  
  // For Firestore documents
  export interface UserDocument extends Omit<User, 'createdAt' | 'updatedAt' | 'lastTokenRefill'> {
    createdAt: string;
    updatedAt: string;
    lastTokenRefill: string;
  }
  
  export interface IdeaDocument extends Omit<Idea, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
  }
  
  export interface VoteDocument extends Omit<Vote, 'createdAt'> {
    createdAt: string;
  }
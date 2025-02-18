import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '../config/firebaseAdmin';
import { User } from '../types';

export class TokenManager {
  private static WEEKLY_TOKENS = 10;
  private static MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

  static async refreshUserTokens(userId: string): Promise<number> {
    const userRef = adminDb.doc(`users/${userId}`);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;
    const lastRefill = (userData.lastTokenRefill as Timestamp).toDate(); // Convert to Date
    const now = Timestamp.now(); // Use Firestore timestamp
    
    // Check if a week has passed since last refill
    if (now.toDate().getTime() - lastRefill.getTime() >= this.MILLISECONDS_IN_WEEK) {
      const newTokens = this.WEEKLY_TOKENS;
      await userRef.update({
        tokens: newTokens,
        lastTokenRefill: now // Store as Timestamp
      });
      return newTokens;
    }
    
    return userData.tokens;
  }

  static async useToken(userId: string): Promise<boolean> {
    const userRef = adminDb.doc(`users/${userId}`);
    
    return adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as User;
      if (userData.tokens < 1) {
        return false;
      }

      transaction.update(userRef, {
        tokens: FieldValue.increment(-1),
        totalVotesCast: FieldValue.increment(1),
        updatedAt: Timestamp.now() // Add timestamp for last update
      });

      return true;
    });
  }
}
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

class AuthService {
  private currentUser: User | null = null;

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        displayName,
        email: user.email,
        tokens: 5,
        createdAt: Timestamp.fromDate(new Date()),
        lastTokenRefill: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`Sign-up failed: ${(error as Error).message}`);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(`Sign-in failed: ${(error as Error).message}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Sign-out failed: ${(error as Error).message}`);
    }
  }
}

export const authService = new AuthService();
// export class AuthService {
//   private static instance: AuthService;
//   private currentUser: User | null = null;

//   private constructor() {}

//   static getInstance(): AuthService {
//     if (!AuthService.instance) {
//       AuthService.instance = new AuthService();
//     }
//     return AuthService.instance;
//   }

//   async getToken(): Promise<string | null> {
//     if (!this.currentUser) {
//       return null;
//     }
//     return await this.currentUser.getIdToken();
//   }

//   setCurrentUser(user: User | null) {
//     this.currentUser = user;
//   }

//   getCurrentUser(): User | null {
//     return this.currentUser;
//   }

//   async getAuthHeader(): Promise<{ Authorization: string } | undefined> {
//     const token = await this.getToken();
//     return token ? { Authorization: `Bearer ${token}` } : undefined;
//   }

//   async logout() {
//     try {
//       const token = await this.getToken();
//       if (!token) return true;

//       await auth.signOut();
//       await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       localStorage.removeItem("token");
//       return true;
//     } catch (error) {
//       console.error("Logout error:", error);
//       await auth.signOut();
//       localStorage.removeItem("token");
//       throw error;
//     }
//   }

//   async signUp(email: string, password: string, username: string): Promise<void> {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     await setDoc(doc(db, "users", user.uid), {
//       userId: user.uid,
//       username,
//       tokensAvailable: 5,
//       createdAt: new Date(),
//     });
//     // No need to call setCurrentUser here; onAuthStateChanged handles it
//   }

//   async signIn(email: string, password: string): Promise<void> {
//     await signInWithEmailAndPassword(auth, email, password);
//     // onAuthStateChanged will update the state
//   }
// }

// export const authService = AuthService.getInstance();

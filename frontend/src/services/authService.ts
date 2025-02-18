import { User } from "firebase/auth";
import { auth } from "../firebase";

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getToken(): Promise<string | null> {
    if (!this.currentUser) {
      return null;
    }
    return await this.currentUser.getIdToken();
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Helper method to get Authorization header
  async getAuthHeader(): Promise<{ Authorization: string } | undefined> {
    const token = await this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  async logout() {
    try {
      const token = await this.getToken();
      if (!token) return true;

      // Always attempt Firebase signout first
      await auth.signOut();

      // Attempt backend logout
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Force cleanup even if backend fails
      await auth.signOut();
      localStorage.removeItem("token");
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();

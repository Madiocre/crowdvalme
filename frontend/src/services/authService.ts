import { User } from 'firebase/auth';

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
}

export const authService = AuthService.getInstance();
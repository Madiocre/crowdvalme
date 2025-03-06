import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { authService } from './services/authService';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || throwError("Missing VITE_FIREBASE_API_KEY"),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || throwError("Missing VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || throwError("Missing VITE_FIREBASE_PROJECT_ID"),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || throwError("Missing VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || throwError("Missing VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: import.meta.env.VITE_FIREBASE_APP_ID || throwError("Missing VITE_FIREBASE_APP_ID")
};

function throwError(message: string): never {
  throw new Error(message);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  authService.setCurrentUser(user); // Ensure this method exists in authService
  if (user) {
    const token = await user.getIdToken(true);
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
});

export default app;
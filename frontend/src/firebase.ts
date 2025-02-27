import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { authService } from './services/authService';

const firebaseConfig = {
  // Your Firebase config object
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set up auth state listener
onAuthStateChanged(auth, async (user) => {
  authService.setCurrentUser(user);
  // Sync token with localStorage
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
});

export default app;
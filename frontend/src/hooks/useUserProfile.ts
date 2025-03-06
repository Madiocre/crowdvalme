/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { User } from "../utils/types";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            ...data,
            userId: user.uid,
            createdAt: data.createdAt.toDate(),
            lastTokenRefill: data.lastTokenRefill.toDate(),
          } as User);
        } else {
          setError("User profile not found");
        }
      } catch (error: any) {
        setError(`Failed to fetch user profile: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}
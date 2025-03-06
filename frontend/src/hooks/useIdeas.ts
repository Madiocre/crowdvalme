/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Idea } from "../utils/types";

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const ideasData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          ideaId: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          expiresAt: doc.data().expiresAt.toDate(),
        } as Idea));
        setIdeas(ideasData);
      } catch (error: any) {
        setError(`Failed to fetch ideas: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return { ideas, loading, error };
}
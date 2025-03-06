/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export function useUserVotes() {
  const { user } = useAuth();
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setVotedIdeas([]);
      return;
    }
    const fetchVotes = async () => {
      try {
        const votesQuery = query(collection(db, "votes"), where("userId", "==", user.uid));
        const snapshot = await getDocs(votesQuery);
        const votedIdeaIds = snapshot.docs.map((doc) => doc.data().ideaId);
        setVotedIdeas(votedIdeaIds);
      } catch (error: any) {
        console.error(`Failed to fetch votes: ${error.message}`);
      }
    };
    fetchVotes();
  }, [user]);

  return votedIdeas;
}
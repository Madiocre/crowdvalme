import { db } from "../firebase";
import { doc, increment, runTransaction, collection, query, where, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Idea } from "../utils/types";

export async function createIdea(
  userId: string,
  title: string,
  description: string,
  videoUrl?: string,
  tags?: string
): Promise<void> {
  const ideaId = `${userId}-${Date.now()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await transaction.get(userRef); // Use transaction.get
    if (!userDoc.exists()) throw new Error("User does not exist");

    const activeIdeasQuery = query(
      collection(db, "ideas"),
      where("userId", "==", userId),
      where("expiresAt", ">", Timestamp.now())
    );
    const activeIdeasSnap = await getDocs(activeIdeasQuery); // Note: This still runs outside transaction
    if (activeIdeasSnap.size >= 3) throw new Error("Maximum of 3 active ideas reached");

    const newIdea: Idea = {
      ideaId,
      userId,
      title,
      description,
      videoUrl,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      createdAt: Timestamp.fromDate(new Date()),
      expiresAt: Timestamp.fromDate(expiresAt),
      voteCount: 0,
    };
    transaction.set(doc(db, "ideas", ideaId), newIdea);
  });
}

export async function voteOnIdea(userId: string, ideaId: string): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", userId);
    const ideaRef = doc(db, "ideas", ideaId);
    const voteRef = doc(db, "votes", `${userId}_${ideaId}`);

    const [userDoc, ideaDoc, voteDoc] = await Promise.all([
      transaction.get(userRef),
      transaction.get(ideaRef),
      transaction.get(voteRef),
    ]);

    if (!userDoc.exists()) throw new Error("User does not exist");
    if (!ideaDoc.exists()) throw new Error("Idea does not exist");
    if (voteDoc.exists()) throw new Error("User has already voted");
    if (userDoc.data()?.tokens <= 0) throw new Error("No tokens available");

    transaction.update(userRef, { tokens: increment(-1) });
    transaction.update(ideaRef, { voteCount: increment(1) });
    transaction.set(voteRef, { userId, ideaId, createdAt: Timestamp.fromDate(new Date()) });
  });
}


// export async function createIdea(userId: string, title: string, description: string, videoUrl?: string, tags?: string): Promise<void> {
//   await runTransaction(db, async (transaction) => {
//     const activeIdeasQuery = query(
//       collection(db, 'ideas'),
//       where('userId', '==', userId),
//       where('expiresAt', '>', new Date())
//     );
//     const activeIdeasSnap = await getDocs(activeIdeasQuery);
//     if (activeIdeasSnap.size >= 3) {
//       throw new Error('You can only have 3 active ideas.');
//     }

//     const ideaId = doc(collection(db, 'ideas')).id;
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//     const newIdea: Idea = {
//       ideaId,
//       userId,
//       title,
//       description,
//       createdAt: new Date(),
//       expiresAt,
//       voteCount: 0,
//     };
//     transaction.set(doc(db, 'ideas', ideaId), newIdea);
//   });
// }

// export async function voteOnIdea(userId: string, ideaId: string): Promise<void> {
//   await runTransaction(db, async (transaction) => {
//     const userRef = doc(db, 'users', userId);
//     const ideaRef = doc(db, 'ideas', ideaId);
//     const voteRef = doc(db, 'votes', `${userId}_${ideaId}`);

//     const userDoc = await transaction.get(userRef);
//     const voteDoc = await transaction.get(voteRef);
//     const ideaDoc = await transaction.get(ideaRef);

//     if (!userDoc.exists()) throw new Error('User not found');
//     if (voteDoc.exists()) throw new Error('You already voted on this idea');
//     if (userDoc.data().tokensAvailable <= 0) throw new Error('No tokens available');
//     if (!ideaDoc.exists() || ideaDoc.data().expiresAt < new Date()) {
//       throw new Error('Idea not found or expired');
//     }

//     transaction.set(voteRef, {
//       voteId: `${userId}_${ideaId}`,
//       userId,
//       ideaId,
//       createdAt: new Date(),
//     });
//     transaction.update(userRef, { tokensAvailable: userDoc.data().tokensAvailable - 1 });
//     transaction.update(ideaRef, { voteCount: ideaDoc.data().voteCount + 1 });
//   });
// }
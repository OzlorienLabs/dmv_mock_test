import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/config";

/**
 * Global leaderboard, backed by a single public-but-owner-written collection:
 *
 *   leaderboard/{uid}   — one denormalized doc per opted-in signed-in user
 *     { uid, name, photoURL, score, updatedAt }
 *
 * Each signed-in user computes their own score on-device (see
 * `leaderboardScore` in progress/store) and publishes just this small doc.
 * Firestore rules make the collection readable by any signed-in user but
 * writable only by its owner — so the board is shared without ever exposing
 * one user's private attempt history to another. Opting out deletes the doc.
 *
 * The opt-out preference itself lives on the owner-only `users/{uid}` doc
 * (`leaderboardOptOut`), so it syncs across devices like the rest of a user's
 * settings.
 */

const COLLECTION = "leaderboard";

export interface LeaderboardEntry {
  uid: string;
  name: string;
  photoURL: string | null;
  score: number;
  updatedAt: number;
}

function normalizeEntry(id: string, data: DocumentData | undefined): LeaderboardEntry {
  return {
    uid: id,
    name:
      typeof data?.name === "string" && data.name.trim()
        ? data.name
        : "Anonymous driver",
    photoURL: typeof data?.photoURL === "string" ? data.photoURL : null,
    score: typeof data?.score === "number" ? data.score : 0,
    updatedAt: typeof data?.updatedAt === "number" ? data.updatedAt : 0,
  };
}

/** Create/update this user's public leaderboard entry. */
export async function cloudPublishLeaderboard(
  uid: string,
  data: { name: string; photoURL: string | null; score: number },
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(
    doc(db, COLLECTION, uid),
    {
      uid,
      name: data.name,
      photoURL: data.photoURL ?? null,
      score: data.score,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

/** Remove this user from the leaderboard (opt-out / account cleanup). */
export async function cloudRemoveLeaderboard(uid: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, COLLECTION, uid));
}

/** Top `topN` entries, highest score first. */
export async function cloudGetTopLeaderboard(
  topN: number,
): Promise<LeaderboardEntry[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("score", "desc"), limit(topN)),
  );
  return snap.docs.map((d) => normalizeEntry(d.id, d.data()));
}

/** This user's own entry, or null if they aren't on the board. */
export async function cloudGetLeaderboardEntry(
  uid: string,
): Promise<LeaderboardEntry | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTION, uid));
  return snap.exists() ? normalizeEntry(snap.id, snap.data()) : null;
}

/**
 * 1-based rank for a given score = (entries with a strictly higher score) + 1.
 * Uses a server-side count aggregation, so it's cheap even with many players.
 * Ties share the better rank.
 */
export async function cloudGetLeaderboardRank(score: number): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const snap = await getCountFromServer(
    query(collection(db, COLLECTION), where("score", ">", score)),
  );
  return snap.data().count + 1;
}

/** Persist the opt-out preference on the owner-only users/{uid} doc. */
export async function cloudSetLeaderboardOptOut(
  uid: string,
  optOut: boolean,
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "users", uid), { leaderboardOptOut: optOut }, { merge: true });
}

/** Read the opt-out preference (defaults to false = opted in). */
export async function cloudGetLeaderboardOptOut(uid: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() && snap.get("leaderboardOptOut") === true;
}

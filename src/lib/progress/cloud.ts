import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/config";
import { summarize, type ProgressSummary, type StoredAttempt } from "./store";

/** Firestore-backed progress, stored under users/{uid}/attempts/{attemptId}. */

export async function cloudSaveAttempt(
  uid: string,
  attempt: StoredAttempt,
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "users", uid, "attempts", attempt.id), attempt);
}

export async function cloudDeleteAttempt(uid: string, id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "attempts", id));
}

export async function cloudGetAttempts(uid: string): Promise<StoredAttempt[]> {
  const db = getDb();
  if (!db) return [];
  const col = collection(db, "users", uid, "attempts");
  const snap = await getDocs(query(col, orderBy("dateISO", "desc"), limit(100)));
  return snap.docs.map((d) => d.data() as StoredAttempt);
}

export async function cloudGetSummary(uid: string): Promise<ProgressSummary> {
  return summarize(await cloudGetAttempts(uid));
}

/** Copy any local attempts not already in the cloud (one-time, on sign-in). */
export async function cloudMigrateLocal(
  uid: string,
  localAttempts: StoredAttempt[],
): Promise<void> {
  if (localAttempts.length === 0) return;
  const existing = new Set((await cloudGetAttempts(uid)).map((a) => a.id));
  const toWrite = localAttempts.filter((a) => !existing.has(a.id));
  await Promise.all(toWrite.map((a) => cloudSaveAttempt(uid, a)));
}

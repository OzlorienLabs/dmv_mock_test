import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/config";
import {
  mergeAttempts,
  summarize,
  withoutDeleted,
  type ProgressSummary,
  type StoredAttempt,
} from "./store";

/**
 * Firestore-backed progress:
 *   users/{uid}/attempts/{attemptId}          — one doc per test attempt
 *   users/{uid}.deletedAttemptIds: string[]   — tombstones (deleted attempt ids)
 *
 * Tombstones let a deletion propagate across devices so a removed test is never
 * resurrected by a merge/re-push from another device that still has it locally.
 */

export async function cloudSaveAttempt(
  uid: string,
  attempt: StoredAttempt,
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "users", uid, "attempts", attempt.id), attempt);
}

/** Delete an attempt doc AND record a tombstone so the deletion propagates. */
export async function cloudDeleteAttempt(uid: string, id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await Promise.all([
    deleteDoc(doc(db, "users", uid, "attempts", id)),
    cloudAddDeletedIds(uid, [id]),
  ]);
}

export async function cloudGetAttempts(uid: string): Promise<StoredAttempt[]> {
  const db = getDb();
  if (!db) return [];
  const col = collection(db, "users", uid, "attempts");
  const snap = await getDocs(query(col, orderBy("dateISO", "desc"), limit(100)));
  return snap.docs.map((d) => d.data() as StoredAttempt);
}

/** Tombstoned (deleted) attempt ids stored on the users/{uid} doc. */
export async function cloudGetDeletedIds(uid: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDoc(doc(db, "users", uid));
  const ids = snap.exists() ? snap.get("deletedAttemptIds") : null;
  return Array.isArray(ids) ? (ids as string[]) : [];
}

export async function cloudAddDeletedIds(
  uid: string,
  ids: string[],
): Promise<void> {
  const db = getDb();
  if (!db || ids.length === 0) return;
  await setDoc(
    doc(db, "users", uid),
    { deletedAttemptIds: arrayUnion(...ids) },
    { merge: true },
  );
}

export async function cloudGetSummary(uid: string): Promise<ProgressSummary> {
  const [attempts, deleted] = await Promise.all([
    cloudGetAttempts(uid),
    cloudGetDeletedIds(uid),
  ]);
  return summarize(withoutDeleted(attempts, deleted));
}

export interface CloudSyncResult {
  /** Merged attempts, with tombstoned ids removed. */
  attempts: StoredAttempt[];
  /** The unioned tombstone set (persist this on-device). */
  deleted: string[];
}

/**
 * Two-way reconcile with the cloud:
 *  - pull cloud attempts + cloud tombstones;
 *  - union this device's tombstones up (so deletions propagate);
 *  - delete any cloud attempt docs that are now tombstoned (in case another
 *    device re-pushed one before the tombstone had propagated);
 *  - push local attempts the cloud is missing and that aren't tombstoned
 *    (self-heals a write that failed earlier — without resurrecting deletions);
 *  - return the merged attempts (minus tombstoned) + the unioned tombstone set.
 */
export async function cloudSync(
  uid: string,
  localAttempts: StoredAttempt[],
  localDeleted: string[],
): Promise<CloudSyncResult> {
  const db = getDb();
  if (!db) {
    return {
      attempts: withoutDeleted(localAttempts, localDeleted),
      deleted: localDeleted,
    };
  }

  const [existing, cloudDeleted] = await Promise.all([
    cloudGetAttempts(uid),
    cloudGetDeletedIds(uid),
  ]);

  const deleted = [...new Set([...localDeleted, ...cloudDeleted])];
  const deletedSet = new Set(deleted);
  const existingIds = new Set(existing.map((a) => a.id));

  const writes: Promise<unknown>[] = [];

  // Propagate this device's new tombstones up.
  const newTombstones = localDeleted.filter((id) => !cloudDeleted.includes(id));
  if (newTombstones.length) writes.push(cloudAddDeletedIds(uid, newTombstones));

  // Remove any cloud attempt docs that are tombstoned.
  for (const a of existing) {
    if (deletedSet.has(a.id)) {
      writes.push(deleteDoc(doc(db, "users", uid, "attempts", a.id)));
    }
  }

  // Push local attempts the cloud is missing and that aren't tombstoned.
  for (const a of localAttempts) {
    if (!existingIds.has(a.id) && !deletedSet.has(a.id)) {
      writes.push(cloudSaveAttempt(uid, a));
    }
  }

  await Promise.all(writes);

  const attempts = withoutDeleted(mergeAttempts(localAttempts, existing), deletedSet);
  return { attempts, deleted };
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type User } from "firebase/auth";
import { useAuth } from "@/lib/firebase/auth";
import {
  deleteAttempt,
  getAttempts,
  getDeletedIds,
  leaderboardScore,
  mergeAttempts,
  saveAttempt,
  setDeletedIds,
  summarize,
  withoutDeleted,
  type ProgressSummary,
  type StoredAttempt,
} from "./store";
import {
  cloudDeleteAttempt,
  cloudGetAttempts,
  cloudSaveAttempt,
  cloudSync,
} from "./cloud";
import {
  cloudGetLeaderboardOptOut,
  cloudPublishLeaderboard,
  cloudRemoveLeaderboard,
  cloudSetLeaderboardOptOut,
} from "@/lib/leaderboard/cloud";
import {
  getLeaderboardOptOut,
  getPublishedSignature,
  setLeaderboardOptOutLocal,
  setPublishedSignature,
} from "@/lib/leaderboard/local";

/** Display name for the leaderboard: real name → email prefix → generic. */
function leaderboardName(user: User): string {
  return (
    user.displayName?.trim() || user.email?.split("@")[0] || "Anonymous driver"
  );
}

/**
 * Publish this user's leaderboard score, but only when it (or their name/photo)
 * changed since the last publish — keeping the public board fresh without a
 * write on every load. A no-op when opted out. Best-effort: callers ignore
 * failures (retried on the next change).
 */
async function publishScore(
  uid: string,
  user: User,
  attempts: StoredAttempt[],
  optOut: boolean,
): Promise<void> {
  if (optOut) return;
  const score = leaderboardScore(attempts);
  const name = leaderboardName(user);
  const photoURL = user.photoURL ?? null;
  const sig = JSON.stringify({ score, name, photoURL });
  if (getPublishedSignature() === sig) return;
  await cloudPublishLeaderboard(uid, { name, photoURL, score });
  setPublishedSignature(sig);
}

interface ProgressContextValue {
  summary: ProgressSummary | null;
  /** Full list of stored attempts for rendering test history. */
  attempts: StoredAttempt[];
  loading: boolean;
  /** Whether progress is syncing to the cloud (signed in) vs on-device only. */
  cloudActive: boolean;
  /** True when a cloud read/write failed (offline, permissions, App Check…). */
  cloudError: boolean;
  recordAttempt: (attempt: StoredAttempt) => Promise<void>;
  /** Remove a single attempt from history (on-device + cloud when signed in). */
  removeAttempt: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  /** Whether this user has opted OUT of the public leaderboard. */
  leaderboardOptOut: boolean;
  /** Opt in/out of the leaderboard (persists the preference + publishes/removes). */
  setLeaderboardOptOut: (optOut: boolean) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, enabled } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudError, setCloudError] = useState(false);
  // Start false so SSR and first client render match; the mount effect below
  // reads the on-device mirror, then the cloud value reconciles it on load.
  const [leaderboardOptOut, setOptOutState] = useState(false);

  // A real (non-anonymous) signed-in user syncs to the cloud; everyone else
  // uses on-device storage.
  const cloudActive = Boolean(enabled && user && !user.isAnonymous);
  const uid = user?.uid ?? null;

  useEffect(() => {
    setOptOutState(getLeaderboardOptOut());
  }, []);

  /**
   * Publish this device's score + reconcile the opt-out preference from the
   * cloud. Isolated and best-effort so a leaderboard hiccup never blanks the
   * dashboard or trips the progress-sync error state.
   */
  const syncLeaderboard = useCallback(
    (all: StoredAttempt[]) => {
      const u = user;
      if (!(cloudActive && uid && u)) return;
      void (async () => {
        try {
          const optOut = await cloudGetLeaderboardOptOut(uid);
          setLeaderboardOptOutLocal(optOut);
          setOptOutState(optOut);
          await publishScore(uid, u, all, optOut);
        } catch {
          // Ignore — retried on the next sync/record.
        }
      })();
    },
    [cloudActive, uid, user],
  );

  const refresh = useCallback(async () => {
    if (cloudActive && uid) {
      try {
        // Two-way reconcile: pushes anything this device is missing from the
        // cloud (self-heals failed writes) and propagates tombstones, so a
        // deletion made anywhere sticks instead of coming back.
        const { attempts: all, deleted } = await cloudSync(
          uid,
          getAttempts(),
          getDeletedIds(),
        );
        setDeletedIds(deleted);
        setAttempts(all);
        setSummary(summarize(all));
        setCloudError(false);
        syncLeaderboard(all);
      } catch {
        const localOnly = withoutDeleted(getAttempts(), getDeletedIds());
        setAttempts(localOnly);
        setSummary(summarize(localOnly));
        setCloudError(true);
      }
    } else {
      const all = withoutDeleted(getAttempts(), getDeletedIds());
      setAttempts(all);
      setSummary(summarize(all));
    }
  }, [cloudActive, uid, syncLeaderboard]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (cloudActive && uid) {
          // Reconcile with the cloud (idempotent): merges local so a just-taken
          // test is never dropped by a lagging read, and honors tombstones so a
          // test deleted on another device stays deleted.
          const { attempts: all, deleted } = await cloudSync(
            uid,
            getAttempts(),
            getDeletedIds(),
          );
          if (!cancelled) {
            setDeletedIds(deleted);
            setAttempts(all);
            setSummary(summarize(all));
            setCloudError(false);
            syncLeaderboard(all);
          }
        } else {
          if (!cancelled) {
            const all = withoutDeleted(getAttempts(), getDeletedIds());
            setAttempts(all);
            setSummary(summarize(all));
          }
        }
      } catch {
        // Cloud read failed (offline, permissions, App Check, transient). Fall
        // back to on-device history and flag the sync error so the user can
        // retry — without this catch the dashboard was blank on another device.
        if (!cancelled) {
          const localOnly = withoutDeleted(getAttempts(), getDeletedIds());
          setAttempts(localOnly);
          setSummary(summarize(localOnly));
          if (cloudActive && uid) setCloudError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [cloudActive, uid, syncLeaderboard]);

  const recordAttempt = useCallback(
    async (attempt: StoredAttempt) => {
      // 1) Persist on-device and reflect it in the UI IMMEDIATELY — merged with
      //    whatever's already loaded (incl. cross-device cloud attempts). No
      //    cloud round-trip in the UI path, so the dashboard shows the
      //    just-finished test right away after client-side navigation.
      saveAttempt(attempt);
      const optimistic = mergeAttempts(getAttempts(), attempts);
      setAttempts(optimistic);
      setSummary(summarize(optimistic));

      // 2) Sync to the cloud in the BACKGROUND so nothing (incl. navigation)
      //    ever waits on the network; reconcile by merging local so a lagging
      //    read can't drop what we just saved.
      const u = user;
      if (cloudActive && uid && u) {
        void (async () => {
          try {
            await cloudSaveAttempt(uid, attempt);
            const merged = withoutDeleted(
              mergeAttempts(getAttempts(), await cloudGetAttempts(uid)),
              getDeletedIds(),
            );
            setAttempts(merged);
            setSummary(summarize(merged));
            setCloudError(false);
            // Update the public leaderboard score (best-effort, no-op if opted
            // out or unchanged since last publish).
            void publishScore(uid, u, merged, leaderboardOptOut).catch(() => {});
          } catch {
            // Offline/transient: the local copy stands and is re-pushed on the
            // next load/refresh (or once the persistent-cache write syncs).
            setCloudError(true);
          }
        })();
      }
    },
    [cloudActive, uid, user, attempts, leaderboardOptOut],
  );

  const removeAttempt = useCallback(
    async (id: string) => {
      // Remove on-device (this also tombstones the id) and update the UI now.
      deleteAttempt(id);
      const remaining = attempts.filter((a) => a.id !== id);
      setAttempts(remaining);
      setSummary(summarize(remaining));

      // Delete from the cloud in the BACKGROUND — never block the caller (or the
      // review screen's navigation) on the round-trip, which is what made
      // signed-in removal appear to hang. cloudDeleteAttempt also writes a
      // tombstone so the deletion propagates to other devices.
      const u = user;
      if (cloudActive && uid && u) {
        void (async () => {
          try {
            await cloudDeleteAttempt(uid, id);
            // Reconcile, honoring tombstones so the deleted id can't come back
            // from a lagging read.
            const merged = withoutDeleted(
              mergeAttempts(getAttempts(), await cloudGetAttempts(uid)),
              getDeletedIds(),
            );
            setAttempts(merged);
            setSummary(summarize(merged));
            setCloudError(false);
            // Removing a test can lower the score (a question may no longer be
            // "last correct"), so refresh the public leaderboard entry.
            void publishScore(uid, u, merged, leaderboardOptOut).catch(() => {});
          } catch {
            // Offline/transient: local copy is already gone.
            setCloudError(true);
          }
        })();
      }
    },
    [cloudActive, uid, user, attempts, leaderboardOptOut],
  );

  const setLeaderboardOptOut = useCallback(
    async (optOut: boolean) => {
      // Reflect the choice immediately on-device.
      setLeaderboardOptOutLocal(optOut);
      setOptOutState(optOut);

      const u = user;
      if (!(cloudActive && uid && u)) return;
      try {
        await cloudSetLeaderboardOptOut(uid, optOut);
        if (optOut) {
          // Leaving: remove the public entry and forget the published signature
          // so re-joining re-publishes.
          await cloudRemoveLeaderboard(uid);
          setPublishedSignature(null);
        } else {
          // Joining: publish the current score right away.
          await publishScore(
            uid,
            u,
            withoutDeleted(getAttempts(), getDeletedIds()),
            false,
          );
        }
        setCloudError(false);
      } catch {
        setCloudError(true);
      }
    },
    [cloudActive, uid, user],
  );

  return (
    <ProgressContext.Provider
      value={{
        summary,
        attempts,
        loading,
        cloudActive,
        cloudError,
        recordAttempt,
        removeAttempt,
        refresh,
        leaderboardOptOut,
        setLeaderboardOptOut,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

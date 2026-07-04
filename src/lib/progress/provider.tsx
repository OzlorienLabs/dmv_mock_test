"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/firebase/auth";
import {
  deleteAttempt,
  getAttempts,
  getDeletedIds,
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
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, enabled } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudError, setCloudError] = useState(false);

  // A real (non-anonymous) signed-in user syncs to the cloud; everyone else
  // uses on-device storage.
  const cloudActive = Boolean(enabled && user && !user.isAnonymous);
  const uid = user?.uid ?? null;

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
  }, [cloudActive, uid]);

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
  }, [cloudActive, uid]);

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
      if (cloudActive && uid) {
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
          } catch {
            // Offline/transient: the local copy stands and is re-pushed on the
            // next load/refresh (or once the persistent-cache write syncs).
            setCloudError(true);
          }
        })();
      }
    },
    [cloudActive, uid, attempts],
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
      if (cloudActive && uid) {
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
          } catch {
            // Offline/transient: local copy is already gone.
            setCloudError(true);
          }
        })();
      }
    },
    [cloudActive, uid, attempts],
  );

  return (
    <ProgressContext.Provider
      value={{ summary, attempts, loading, cloudActive, cloudError, recordAttempt, removeAttempt, refresh }}
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

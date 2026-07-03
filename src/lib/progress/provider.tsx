"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/firebase/auth";
import {
  deleteAttempt,
  getAttempts,
  mergeAttempts,
  saveAttempt,
  summarize,
  type ProgressSummary,
  type StoredAttempt,
} from "./store";
import {
  cloudDeleteAttempt,
  cloudGetAttempts,
  cloudMigrateLocal,
  cloudSaveAttempt,
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
  const migratedFor = useRef<string | null>(null);

  // A real (non-anonymous) signed-in user syncs to the cloud; everyone else
  // uses on-device storage.
  const cloudActive = Boolean(enabled && user && !user.isAnonymous);
  const uid = user?.uid ?? null;

  const refresh = useCallback(async () => {
    if (cloudActive && uid) {
      try {
        // Re-push anything on this device that isn't in the cloud yet (self-heals
        // a write that failed earlier), then pull the merged set.
        const cloudAll = await cloudMigrateLocal(uid, getAttempts());
        const all = mergeAttempts(getAttempts(), cloudAll);
        setAttempts(all);
        setSummary(summarize(all));
        setCloudError(false);
      } catch {
        const localOnly = getAttempts();
        setAttempts(localOnly);
        setSummary(summarize(localOnly));
        setCloudError(true);
      }
    } else {
      const all = getAttempts();
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
          // On first sign-in, migrate returns the merged cloud set so we don't
          // issue a second read; afterwards just read. Merge with local so an
          // attempt just saved on this device — but not yet in this cloud read
          // (e.g. a test finished while this load was in flight) — is never
          // dropped, which otherwise made a just-taken test disappear from
          // history until a full refresh.
          let cloudAll: StoredAttempt[];
          if (migratedFor.current !== uid) {
            cloudAll = await cloudMigrateLocal(uid, getAttempts());
            migratedFor.current = uid;
          } else {
            cloudAll = await cloudGetAttempts(uid);
          }
          const all = mergeAttempts(getAttempts(), cloudAll);
          if (!cancelled) {
            setAttempts(all);
            setSummary(summarize(all));
            setCloudError(false);
          }
        } else {
          if (!cancelled) {
            const all = getAttempts();
            setAttempts(all);
            setSummary(summarize(all));
          }
        }
      } catch {
        // Cloud read/migrate failed (offline, permissions, App Check, transient).
        // Without this catch the error was unhandled and cloud data never
        // rendered — leaving the dashboard blank on another device. Fall back to
        // on-device history and flag the sync error so the user can retry.
        if (!cancelled) {
          const localOnly = getAttempts();
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
            const merged = mergeAttempts(getAttempts(), await cloudGetAttempts(uid));
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
      // Remove on-device and from the UI immediately.
      deleteAttempt(id);
      const remaining = attempts.filter((a) => a.id !== id);
      setAttempts(remaining);
      setSummary(summarize(remaining));

      // Delete from the cloud in the BACKGROUND — never block the caller (or the
      // review screen's navigation) on the round-trip, which is what made
      // signed-in removal appear to hang.
      if (cloudActive && uid) {
        void (async () => {
          try {
            await cloudDeleteAttempt(uid, id);
            // Reconcile with the cloud, but never let the just-deleted id come
            // back from a lagging read.
            const merged = mergeAttempts(
              getAttempts(),
              await cloudGetAttempts(uid),
            ).filter((a) => a.id !== id);
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

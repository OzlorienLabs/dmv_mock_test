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
  const migratedFor = useRef<string | null>(null);

  // A real (non-anonymous) signed-in user syncs to the cloud; everyone else
  // uses on-device storage.
  const cloudActive = Boolean(enabled && user && !user.isAnonymous);
  const uid = user?.uid ?? null;

  const refresh = useCallback(async () => {
    if (cloudActive && uid) {
      const all = mergeAttempts(getAttempts(), await cloudGetAttempts(uid));
      setAttempts(all);
      setSummary(summarize(all));
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
          if (migratedFor.current !== uid) {
            await cloudMigrateLocal(uid, getAttempts());
            migratedFor.current = uid;
          }
          // Merge with local so an attempt just saved on this device — but not
          // yet in this cloud read (e.g. a test finished while this load was in
          // flight) — is never dropped, which otherwise made a just-taken test
          // disappear from history until a full refresh.
          const all = mergeAttempts(getAttempts(), await cloudGetAttempts(uid));
          if (!cancelled) {
            setAttempts(all);
            setSummary(summarize(all));
          }
        } else {
          if (!cancelled) {
            const all = getAttempts();
            setAttempts(all);
            setSummary(summarize(all));
          }
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
          } catch {
            // Offline/transient: the local copy stands and migrates on sign-in.
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
          } catch {
            // Offline/transient: local copy is already gone.
          }
        })();
      }
    },
    [cloudActive, uid, attempts],
  );

  return (
    <ProgressContext.Provider
      value={{ summary, attempts, loading, cloudActive, recordAttempt, removeAttempt, refresh }}
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

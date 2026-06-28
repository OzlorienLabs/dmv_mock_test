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
  getAttempts,
  getSummary,
  saveAttempt,
  type ProgressSummary,
  type StoredAttempt,
} from "./store";
import { cloudGetSummary, cloudMigrateLocal, cloudSaveAttempt } from "./cloud";

interface ProgressContextValue {
  summary: ProgressSummary | null;
  loading: boolean;
  /** Whether progress is syncing to the cloud (signed in) vs on-device only. */
  cloudActive: boolean;
  recordAttempt: (attempt: StoredAttempt) => Promise<void>;
  refresh: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, enabled } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const migratedFor = useRef<string | null>(null);

  // A real (non-anonymous) signed-in user syncs to the cloud; everyone else
  // uses on-device storage.
  const cloudActive = Boolean(enabled && user && !user.isAnonymous);
  const uid = user?.uid ?? null;

  const refresh = useCallback(async () => {
    if (cloudActive && uid) {
      setSummary(await cloudGetSummary(uid));
    } else {
      setSummary(getSummary());
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
          const s = await cloudGetSummary(uid);
          if (!cancelled) setSummary(s);
        } else {
          if (!cancelled) setSummary(getSummary());
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
      // Always keep an on-device copy (works offline and as guest).
      saveAttempt(attempt);
      if (cloudActive && uid) {
        try {
          await cloudSaveAttempt(uid, attempt);
        } catch {
          // Offline or transient error: the local copy will migrate later.
        }
      }
      await refresh();
    },
    [cloudActive, uid, refresh],
  );

  return (
    <ProgressContext.Provider
      value={{ summary, loading, cloudActive, recordAttempt, refresh }}
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

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import { getAppCheckToken } from "@/lib/firebase/config";

interface KeyStatus {
  configured: boolean;
  hasKey: boolean;
  masked: string | null;
}

export default function SettingsPage() {
  const { enabled, loading, user } = useAuth();
  const [status, setStatus] = useState<KeyStatus | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const signedIn = Boolean(user && !user.isAnonymous);

  const authedFetch = useCallback(
    async (method: string, body?: unknown) => {
      if (!user) throw new Error("Not signed in");
      const token = await user.getIdToken();
      const appCheck = await getAppCheckToken();
      return fetch("/api/key", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(appCheck ? { "X-Firebase-AppCheck": appCheck } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    [user],
  );

  const loadStatus = useCallback(async () => {
    if (!signedIn) return;
    try {
      const res = await authedFetch("GET");
      setStatus((await res.json()) as KeyStatus);
    } catch {
      /* ignore */
    }
  }, [signedIn, authedFetch]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await authedFetch("POST", { key });
      const d = await res.json();
      if (res.ok) {
        setMsg("Key saved securely.");
        setKey("");
        await loadStatus();
      } else {
        setMsg(
          d.error === "not_configured"
            ? "The AI backend isn’t enabled on this server yet."
            : d.error === "invalid_key"
              ? "That key looks invalid."
              : "Couldn’t save the key.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setMsg(null);
    try {
      await authedFetch("DELETE");
      await loadStatus();
      setMsg("Key removed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ca-ink">AI audio settings</h1>
        <Link
          href="/"
          className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
        >
          Home
        </Link>
      </div>

      {!enabled ? (
        <p className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
          Accounts and AI features aren’t configured on this deployment. The app
          still works fully as a guest.
        </p>
      ) : loading ? (
        <p className="text-sm text-ca-muted">Loading…</p>
      ) : !signedIn ? (
        <p className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
          Sign in (top right) to add your own Gemini key for AI explanations in
          extra languages.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
            <p className="mb-2">
              Default languages (English, Bengali, Hindi, Spanish) use
              pre-generated explanations — no key needed. Add your own{" "}
              <a
                className="text-ca-blue underline"
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gemini API key
              </a>{" "}
              to generate explanations in any other language on demand.
            </p>
            <p className="rounded-md bg-ca-bg p-2 text-xs text-ca-muted">
              Your key is encrypted on the server and never shown again. Please
              set a low daily request limit on your key in Google AI Studio to
              control cost.
            </p>
          </div>

          {status?.configured === false && (
            <p className="text-sm text-ca-red">
              The AI backend isn’t enabled on this server yet.
            </p>
          )}

          <div className="rounded-xl border border-ca-line bg-white p-4">
            <p className="text-sm font-semibold text-ca-ink">
              {status?.hasKey ? `Key on file: ${status.masked}` : "No key saved"}
            </p>
            <form onSubmit={save} className="mt-3 space-y-2">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Paste your Gemini API key"
                className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy || key.trim().length < 20}
                  className="rounded-md bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark disabled:opacity-50"
                >
                  Save key
                </button>
                {status?.hasKey && (
                  <button
                    type="button"
                    onClick={remove}
                    disabled={busy}
                    className="rounded-md border border-ca-line px-4 py-2 text-sm font-semibold text-ca-red"
                  >
                    Remove
                  </button>
                )}
              </div>
            </form>
            {msg && <p className="mt-2 text-sm text-ca-gray">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

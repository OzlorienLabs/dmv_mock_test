"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";

/**
 * Header account control. Renders nothing when Firebase isn't configured (the
 * app works fully as a guest). When configured, offers Google + email sign-in
 * and shows the signed-in account.
 */
export function AccountMenu() {
  const { enabled, loading, user, signInWithGoogle, signInWithEmail, registerWithEmail, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!enabled) return null;
  if (loading) {
    return <span className="text-sm text-white/80">…</span>;
  }

  if (user && !user.isAnonymous) {
    const label = user.email ?? user.displayName ?? "Account";
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-[10rem] truncate text-sm text-white/90 sm:inline">
          {label}
        </span>
        <Link
          href="/settings"
          className="rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
        >
          Settings
        </Link>
        <button
          type="button"
          onClick={() => signOutUser()}
          className="rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
        >
          Sign out
        </button>
      </div>
    );
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setOpen(false);
      setEmail("");
      setPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message.replace("Firebase:", "").trim() : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
      >
        Sign in
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-ca-line bg-white p-4 text-ca-ink shadow-lg">
          <p className="mb-2 text-xs text-ca-muted">
            Sign in to save your progress across devices.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(signInWithGoogle)}
            className="mb-3 w-full rounded-md border border-ca-line bg-white py-2 text-sm font-semibold hover:bg-ca-bg disabled:opacity-50"
          >
            Continue with Google
          </button>

          <div className="mb-2 flex items-center gap-2 text-xs text-ca-muted">
            <span className="h-px flex-1 bg-ca-line" /> or <span className="h-px flex-1 bg-ca-line" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(() =>
                mode === "signin"
                  ? signInWithEmail(email, password)
                  : registerWithEmail(email, password),
              );
            }}
            className="space-y-2"
          >
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
            />
            {error && <p className="text-xs text-ca-red">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-ca-blue py-2 text-sm font-bold text-white hover:bg-ca-blue-dark disabled:opacity-50"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode((m) => (m === "signin" ? "register" : "signin"))}
            className="mt-2 text-xs text-ca-blue underline"
          >
            {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
          </button>
        </div>
      )}
    </div>
  );
}

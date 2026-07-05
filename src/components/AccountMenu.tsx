"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type User } from "firebase/auth";
import { useAuth, isPasswordUser, isGoogleUser } from "@/lib/firebase/auth";

/**
 * Header account control. Renders nothing when Firebase isn't configured (the
 * app works fully as a guest). Signed out: Google + email sign-in. Signed in:
 * an avatar (Google photo or initials) opening a menu with account info,
 * Settings, an optional Change password link, and a confirmed Sign out.
 */
export function AccountMenu() {
  const auth = useAuth();
  const { enabled, loading, user } = auth;

  if (!enabled) return null;
  if (loading) return <span className="text-sm text-white/80">…</span>;

  if (user && !user.isAnonymous) {
    return <SignedInMenu user={user} onSignOut={auth.signOutUser} />;
  }
  return <SignInMenu />;
}

function initialsOf(user: User): string {
  const name = user.displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (user.email?.[0] ?? "?").toUpperCase();
}

function providerLabel(user: User): string {
  const google = isGoogleUser(user);
  const password = isPasswordUser(user);
  if (google && password) return "Google · Email & password";
  if (google) return "Signed in with Google";
  if (password) return "Email & password";
  return "Signed in";
}

function Avatar({ user, size = 36 }: { user: User; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const dim = { width: size, height: size };
  if (user.photoURL && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.photoURL}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={dim}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ ...dim, fontSize: size * 0.4 }}
      className="grid place-items-center rounded-full bg-ca-gold font-bold text-ca-blue"
    >
      {initialsOf(user)}
    </span>
  );
}

function SignedInMenu({ user, onSignOut }: { user: User; onSignOut: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setConfirming(false);
  }

  const label = user.displayName || user.email || "Account";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${label}`}
        data-testid="account-avatar"
        className="rounded-full ring-2 ring-white/40 transition hover:ring-white/80"
      >
        <Avatar user={user} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-ca-line bg-white text-ca-ink shadow-lg"
        >
          {/* Account info */}
          <div className="flex items-center gap-3 border-b border-ca-line p-3">
            <Avatar user={user} size={40} />
            <div className="min-w-0">
              {user.displayName && (
                <p className="truncate text-sm font-semibold">{user.displayName}</p>
              )}
              <p className="truncate text-xs text-ca-gray" data-testid="account-email">
                {user.email}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-ca-muted">
                {providerLabel(user)}
              </p>
            </div>
          </div>

          {!confirming ? (
            <div className="p-1.5">
              <Link
                href="/leaderboard"
                role="menuitem"
                onClick={close}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-ca-bg"
              >
                🏆 Leaderboard
              </Link>
              <Link
                href="/settings"
                role="menuitem"
                onClick={close}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-ca-bg"
              >
                Settings
              </Link>
              {isPasswordUser(user) && (
                <Link
                  href="/settings#account"
                  role="menuitem"
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-ca-bg"
                >
                  Change password
                </Link>
              )}
              <button
                type="button"
                role="menuitem"
                data-testid="signout-open"
                onClick={() => setConfirming(true)}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-ca-red hover:bg-ca-red-bg"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-sm font-semibold">Sign out?</p>
              <p className="mt-0.5 text-xs text-ca-gray">
                Your progress stays synced to this account.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="flex-1 rounded-md border border-ca-line px-3 py-2 text-sm font-semibold text-ca-gray hover:bg-ca-bg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="signout-confirm"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await onSignOut();
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="flex-1 rounded-md bg-ca-red px-3 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SignInMenu() {
  const { signInWithGoogle, signInWithEmail, registerWithEmail } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

"use client";

import { useState } from "react";
import { useAuth, isPasswordUser, isGoogleUser } from "@/lib/firebase/auth";

/**
 * Account section for the Settings page: which email is linked, the sign-in
 * method, and — only for email/password accounts — a change-password form
 * (re-authenticates, then updates). Google-only accounts manage their password
 * in their Google Account, so no form is shown.
 */
export function AccountSettings() {
  const { user, changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!user) return null;
  const password = isPasswordUser(user);
  const google = isGoogleUser(user);
  const method =
    google && password
      ? "Google and email/password"
      : google
        ? "Google"
        : "Email & password";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 6) {
      setMsg({ ok: false, text: "New password must be at least 6 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: "New passwords don’t match." });
      return;
    }
    setBusy(true);
    try {
      await changePassword(current, next);
      setMsg({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      const text = /wrong-password|invalid-credential|invalid-login/i.test(raw)
        ? "Current password is incorrect."
        : /weak-password/i.test(raw)
          ? "New password is too weak."
          : /too-many-requests/i.test(raw)
            ? "Too many attempts. Please try again later."
            : /requires-recent-login/i.test(raw)
              ? "Please sign out and back in, then try again."
              : "Couldn’t change the password.";
      setMsg({ ok: false, text });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="account" className="scroll-mt-20 space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ca-muted">Account</h2>

      <div className="rounded-xl border border-ca-line bg-white p-4 text-sm">
        <dl className="space-y-1.5">
          <div className="flex justify-between gap-3">
            <dt className="text-ca-muted">Email</dt>
            <dd className="truncate font-semibold text-ca-ink">{user.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ca-muted">Sign-in method</dt>
            <dd className="font-semibold text-ca-ink">{method}</dd>
          </div>
        </dl>
      </div>

      {password ? (
        <form onSubmit={submit} className="rounded-xl border border-ca-line bg-white p-4">
          <p className="text-sm font-semibold text-ca-ink">Change password</p>
          <div className="mt-3 space-y-2">
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="Current password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
            />
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="New password (min 6 characters)"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
            />
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy || !current || !next}
              className="rounded-md bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark disabled:opacity-50"
            >
              Update password
            </button>
          </div>
          {msg && (
            <p className={`mt-2 text-sm ${msg.ok ? "text-ca-green" : "text-ca-red"}`}>
              {msg.text}
            </p>
          )}
        </form>
      ) : (
        <p className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
          You sign in with Google. Manage your password in your{" "}
          <a
            className="text-ca-blue underline"
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Account
          </a>
          .
        </p>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import { AccountSettings } from "@/components/AccountSettings";
import { LeaderboardSettings } from "@/components/LeaderboardSettings";

export default function SettingsPage() {
  const { enabled, loading, user } = useAuth();
  const signedIn = Boolean(user && !user.isAnonymous);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ca-ink">Settings</h1>
        <Link
          href="/"
          className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
        >
          Home
        </Link>
      </div>

      {!enabled ? (
        <p className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
          Accounts aren’t configured on this deployment. The app still works
          fully as a guest — your progress is saved on this device.
        </p>
      ) : loading ? (
        <p className="text-sm text-ca-muted">Loading…</p>
      ) : !signedIn ? (
        <p className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
          Sign in (top right) to manage your account and sync your progress
          across devices.
        </p>
      ) : (
        <div className="space-y-6">
          <AccountSettings />
          <LeaderboardSettings />
        </div>
      )}
    </div>
  );
}

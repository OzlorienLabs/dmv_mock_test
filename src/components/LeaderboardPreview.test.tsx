import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import type { LeaderboardEntry } from "@/lib/leaderboard/cloud";

// Stub the auth hook and the one cloud call the preview makes.
vi.mock("@/lib/firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/firebase/auth")>();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("@/lib/leaderboard/cloud", () => ({
  cloudGetTopLeaderboard: vi.fn(),
}));

import { LeaderboardPreview } from "./LeaderboardPreview";
import * as authMod from "@/lib/firebase/auth";
import { cloudGetTopLeaderboard } from "@/lib/leaderboard/cloud";

const useAuthMock = vi.mocked(authMod.useAuth);
const getTop = vi.mocked(cloudGetTopLeaderboard);

function ctx(user: User | null, enabled = true): ReturnType<typeof authMod.useAuth> {
  return {
    user,
    loading: false,
    enabled,
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    registerWithEmail: vi.fn(),
    signInAsGuest: vi.fn(),
    signOutUser: vi.fn(),
    changePassword: vi.fn(),
  } as unknown as ReturnType<typeof authMod.useAuth>;
}

function fakeUser(overrides: Partial<User>): User {
  return {
    uid: "me",
    isAnonymous: false,
    displayName: null,
    email: null,
    photoURL: null,
    providerData: [],
    ...overrides,
  } as unknown as User;
}

const ENTRIES: LeaderboardEntry[] = [
  { uid: "u1", name: "Alice", photoURL: null, score: 42, updatedAt: 0 },
  { uid: "u2", name: "Bob", photoURL: null, score: 39, updatedAt: 0 },
  { uid: "u3", name: "Carol", photoURL: null, score: 30, updatedAt: 0 },
];

beforeEach(() => {
  useAuthMock.mockReset();
  getTop.mockReset();
});

describe("LeaderboardPreview", () => {
  it("renders the top players (limited to 5) with scores and a View all link", async () => {
    useAuthMock.mockReturnValue(ctx(null));
    getTop.mockResolvedValue(ENTRIES);
    render(<LeaderboardPreview />);

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all/i })).toHaveAttribute(
      "href",
      "/leaderboard",
    );
    expect(getTop).toHaveBeenCalledWith(5);
  });

  it("highlights the signed-in user's own row", async () => {
    useAuthMock.mockReturnValue(ctx(fakeUser({ uid: "u2", displayName: "Bob" })));
    getTop.mockResolvedValue(ENTRIES);
    render(<LeaderboardPreview />);

    // Bob is the current user → his row is tagged "(You)".
    const you = await screen.findByText("(You)");
    expect(you).toBeInTheDocument();
    // The hook is hidden for signed-in users.
    expect(screen.queryByText(/to join and track your rank/i)).toBeNull();
  });

  it("shows a sign-in hook for guests", async () => {
    useAuthMock.mockReturnValue(ctx(null));
    getTop.mockResolvedValue(ENTRIES);
    render(<LeaderboardPreview />);

    await screen.findByText("Alice");
    expect(screen.getByText(/Sign in .* to join and track your rank/i)).toBeInTheDocument();
  });

  it("falls back to a linking card when the board is empty", async () => {
    useAuthMock.mockReturnValue(ctx(null));
    getTop.mockResolvedValue([]);
    render(<LeaderboardPreview />);

    await waitFor(() =>
      expect(screen.getByText(/See the top drivers ranked by/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/leaderboard");
  });

  it("shows the fallback and skips the fetch when Firebase is disabled", () => {
    useAuthMock.mockReturnValue(ctx(null, false));
    render(<LeaderboardPreview />);

    expect(screen.getByText(/See the top drivers ranked by/i)).toBeInTheDocument();
    expect(getTop).not.toHaveBeenCalled();
  });
});

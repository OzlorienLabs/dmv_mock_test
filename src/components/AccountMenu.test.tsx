import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";

// Keep the real provider helpers; only stub the React hook.
vi.mock("@/lib/firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/firebase/auth")>();
  return { ...actual, useAuth: vi.fn() };
});

import { AccountMenu } from "./AccountMenu";
import * as authMod from "@/lib/firebase/auth";

const useAuthMock = vi.mocked(authMod.useAuth);

function fakeUser(overrides: Partial<User> & { providerId: string }): User {
  const { providerId, ...rest } = overrides;
  return {
    isAnonymous: false,
    displayName: null,
    email: null,
    photoURL: null,
    providerData: [{ providerId } as User["providerData"][number]],
    ...rest,
  } as unknown as User;
}

function ctx(user: User | null, signOutUser = vi.fn(async () => {})) {
  return {
    user,
    loading: false,
    enabled: true,
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    registerWithEmail: vi.fn(),
    signInAsGuest: vi.fn(),
    signOutUser,
    changePassword: vi.fn(),
  } as unknown as ReturnType<typeof authMod.useAuth>;
}

beforeEach(() => useAuthMock.mockReset());

describe("AccountMenu", () => {
  it("renders nothing until Firebase is enabled / not signed in shows Sign in", () => {
    useAuthMock.mockReturnValue({ ...ctx(null), enabled: false } as ReturnType<typeof authMod.useAuth>);
    const { container, rerender } = render(<AccountMenu />);
    expect(container).toBeEmptyDOMElement();

    useAuthMock.mockReturnValue(ctx(null));
    rerender(<AccountMenu />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows initials + email + Change password for an email/password user", () => {
    const user = fakeUser({ providerId: "password", email: "jane@example.com", displayName: "Jane Rider" });
    useAuthMock.mockReturnValue(ctx(user));
    render(<AccountMenu />);

    // Avatar shows initials (no photoURL), and it's not an <img>.
    const avatar = screen.getByTestId("account-avatar");
    expect(avatar).toHaveTextContent("JR");
    expect(avatar.querySelector("img")).toBeNull();

    fireEvent.click(avatar);
    expect(screen.getByTestId("account-email")).toHaveTextContent("jane@example.com");
    expect(screen.getByText(/Email & password/i)).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /change password/i })).toBeInTheDocument();
  });

  it("shows the Google photo and hides Change password for a Google user", () => {
    const user = fakeUser({
      providerId: "google.com",
      email: "g@example.com",
      displayName: "Gina Google",
      photoURL: "https://example.com/pic.jpg",
    });
    useAuthMock.mockReturnValue(ctx(user));
    render(<AccountMenu />);

    const img = screen.getByTestId("account-avatar").querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "https://example.com/pic.jpg");

    fireEvent.click(screen.getByTestId("account-avatar"));
    expect(screen.getByText(/Signed in with Google/i)).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /change password/i })).toBeNull();
  });

  it("requires confirmation before signing out", async () => {
    const signOutUser = vi.fn(async () => {});
    const user = fakeUser({ providerId: "password", email: "jane@example.com" });
    useAuthMock.mockReturnValue(ctx(user, signOutUser));
    render(<AccountMenu />);

    fireEvent.click(screen.getByTestId("account-avatar"));
    fireEvent.click(screen.getByTestId("signout-open"));
    // A confirmation appears; nothing has signed out yet.
    expect(signOutUser).not.toHaveBeenCalled();
    expect(screen.getByText(/Sign out\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("signout-confirm"));
    await waitFor(() => expect(signOutUser).toHaveBeenCalledTimes(1));
  });
});

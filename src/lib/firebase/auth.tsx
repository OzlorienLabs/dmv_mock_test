"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { firebaseEnabled, getFirebaseAuth } from "./config";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  enabled: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOutUser: () => Promise<void>;
  /** Re-authenticate with the current password, then set a new one. */
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

/** Sign-in providers linked to the account (e.g. "password", "google.com"). */
export function providerIds(user: User | null): string[] {
  return user?.providerData.map((p) => p.providerId) ?? [];
}

/** True when the account can sign in with an email + password. */
export function isPasswordUser(user: User | null): boolean {
  return providerIds(user).includes("password");
}

/** True when the account is linked to Google sign-in. */
export function isGoogleUser(user: User | null): boolean {
  return providerIds(user).includes("google.com");
}

const notConfigured = () => {
  throw new Error("Sign-in is not configured.");
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: firebaseEnabled,
  enabled: firebaseEnabled,
  signInWithGoogle: notConfigured,
  signInWithEmail: notConfigured,
  registerWithEmail: notConfigured,
  signInAsGuest: notConfigured,
  signOutUser: notConfigured,
  changePassword: notConfigured,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    if (!firebaseEnabled) {
      return {
        user: null,
        loading: false,
        enabled: false,
        signInWithGoogle: notConfigured,
        signInWithEmail: notConfigured,
        registerWithEmail: notConfigured,
        signInAsGuest: notConfigured,
        signOutUser: notConfigured,
        changePassword: notConfigured,
      };
    }
    const auth = () => {
      const a = getFirebaseAuth();
      if (!a) throw new Error("Auth unavailable.");
      return a;
    };
    return {
      user,
      loading,
      enabled: true,
      signInWithGoogle: async () => {
        await signInWithPopup(auth(), new GoogleAuthProvider());
      },
      signInWithEmail: async (email, password) => {
        await signInWithEmailAndPassword(auth(), email, password);
      },
      registerWithEmail: async (email, password) => {
        await createUserWithEmailAndPassword(auth(), email, password);
      },
      signInAsGuest: async () => {
        await signInAnonymously(auth());
      },
      signOutUser: async () => {
        await signOut(auth());
      },
      changePassword: async (currentPassword, newPassword) => {
        const a = auth();
        const u = a.currentUser;
        if (!u || !u.email) throw new Error("No email/password account is signed in.");
        // Re-authenticate first — updatePassword requires a recent login.
        const cred = EmailAuthProvider.credential(u.email, currentPassword);
        await reauthenticateWithCredential(u, cred);
        await updatePassword(u, newPassword);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

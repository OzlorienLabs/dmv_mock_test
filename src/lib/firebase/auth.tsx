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
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
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
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

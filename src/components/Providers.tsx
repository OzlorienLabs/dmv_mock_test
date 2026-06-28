"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/firebase/auth";
import { ProgressProvider } from "@/lib/progress/provider";

/** App-wide client providers: auth state + unified progress (local/cloud). */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </AuthProvider>
  );
}

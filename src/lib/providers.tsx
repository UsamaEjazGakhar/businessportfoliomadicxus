"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}

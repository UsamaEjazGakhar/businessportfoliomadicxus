"use client";
import { useSession } from "next-auth/react";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function SessionLoader() {
  const { status } = useSession();
  if (status === "loading") {
    return <LoadingOverlay />;
  }
  return null;
}

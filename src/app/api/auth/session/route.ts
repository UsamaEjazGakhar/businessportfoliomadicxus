import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * GET /api/auth/session
 * Returns the current session as JSON. If no session exists, a 401 response is sent.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  return NextResponse.json(session);
}

/**
 * POST /api/auth/session
 * Delegates to the built‑in NextAuth handler so that the standard POST flow works.
 */
export { POST } from "@/app/api/auth/[...nextauth]/route";

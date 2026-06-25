import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/auth/session GET:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// POST is not used for session; we can return 405 Method Not Allowed
export async function POST() {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
}

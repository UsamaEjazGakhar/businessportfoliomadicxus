import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment click counter and get target URL
    const project = await prisma.project.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
      select: { targetUrl: true },
    });

    // Perform HTTP 302 temporary redirect to target site
    return NextResponse.redirect(new URL(project.targetUrl));
  } catch {
    // Fallback redirect to homepage
    return NextResponse.redirect(new URL("/", req.url));
  }
}

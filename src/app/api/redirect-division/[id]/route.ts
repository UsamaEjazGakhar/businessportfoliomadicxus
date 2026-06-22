import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const division = await prisma.businessDivision.findUnique({
      where: { id },
      select: { targetUrl: true },
    });

    if (division?.targetUrl) {
      return NextResponse.redirect(new URL(division.targetUrl));
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

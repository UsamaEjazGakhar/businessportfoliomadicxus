import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json({ success: true, data: settingsMap }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json(); // Map of key -> value
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ success: false, message: "Invalid payload format" }, { status: 400 });
    }

    const updates = Object.entries(body).map(([key, value]) => {
      const valStr = typeof value === "string" ? value : JSON.stringify(value);
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value: valStr },
        create: { key, value: valStr },
      });
    });

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Settings updated successfully" }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

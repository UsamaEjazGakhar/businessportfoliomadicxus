import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const blogUpdateSchema = z.object({
  status: z.enum(["Draft", "Published"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = blogUpdateSchema.parse(body);

    const updated = await (prisma as any).blogPost.update({
      where: { id },
      data: {
        status: validatedData.status,
        publishedAt: validatedData.status === "Published" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await (prisma as any).blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}


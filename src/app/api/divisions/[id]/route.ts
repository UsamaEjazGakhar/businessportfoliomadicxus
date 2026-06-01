import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const divisionUpdateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon is required"),
  iconColor: z.string().min(1, "Icon color is required"),
  sortOrder: z.number().int().optional(),
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
    const validatedData = divisionUpdateSchema.parse(body);

    const updated = await prisma.businessDivision.update({
      where: { id },
      data: validatedData,
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

    await prisma.businessDivision.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Division deleted successfully" }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

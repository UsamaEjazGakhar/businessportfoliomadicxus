import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const divisionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon is required"),
  iconColor: z.string().min(1, "Icon color is required"),
  sortOrder: z.number().int().optional(),
  targetUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const divisions = await prisma.businessDivision.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { projects: true } } },
    });
    return NextResponse.json({ success: true, data: divisions }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = divisionSchema.parse(body);

    const division = await prisma.businessDivision.create({
      data: {
        ...validatedData,
        sortOrder: validatedData.sortOrder ?? 0,
        targetUrl: validatedData.targetUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: division }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

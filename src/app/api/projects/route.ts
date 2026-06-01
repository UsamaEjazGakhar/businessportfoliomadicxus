import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";
import { Prisma, ProjectStatus } from "@prisma/client";

const projectCreateSchema = z.object({
  divisionId: z.string().uuid(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(10),
  thumbnailUrl: z.string().max(512),
  targetUrl: z.string().url().max(512),
  status: z.enum(["ACTIVE", "IN_DEVELOPMENT", "MAINTENANCE", "REDIRECTED"]).optional(),
  category: z.string().min(1),
  sortOrder: z.number().int().optional(),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(255).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const filter: Prisma.ProjectWhereInput = {};
    if (category) filter.category = category;
    if (status) filter.status = status as ProjectStatus;

    const projects = await prisma.project.findMany({
      where: filter,
      orderBy: { sortOrder: "asc" },
      include: { division: { select: { title: true, slug: true } } },
    });

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
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
    const validatedData = projectCreateSchema.parse(body);

    const project = await prisma.project.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const templateSchema = z.object({
  instituteName: z.string().min(1, "Institute name is required"),
  instituteAddress: z.string().min(1, "Institute address is required"),
  instituteContact: z.string().min(1, "Institute contact is required"),
});

export async function GET() {
  try {
    const templates = await prisma.admissionFormTemplate.findMany();
    return NextResponse.json({ success: true, data: templates }, { status: 200 });
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
    const validatedData = templateSchema.parse(body);

    const template = await prisma.admissionFormTemplate.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
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

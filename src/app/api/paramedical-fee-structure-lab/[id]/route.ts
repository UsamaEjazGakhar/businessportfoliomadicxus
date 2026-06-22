import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const paramedicalFeeUpdateSchema = z.object({
  part1AdmissionFee: z.string().optional(),
  part1MonthlyFee: z.string().optional(),
  part1TotalFee: z.string().optional(),
  part2MonthlyFee: z.string().optional(),
  part2TotalFee: z.string().optional(),
  note: z.string().optional(),
  examFeeNote: z.string().optional(),
  admissionCriteria: z.string().optional(),
  ageLimit: z.string().optional(),
  scholarship: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const feeStructure = await prisma.paramedicalFeeStructureLabTemplate.findUnique({
      where: { id },
    });
    if (!feeStructure) {
      return NextResponse.json({ success: false, message: "Fee structure not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: feeStructure }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = paramedicalFeeUpdateSchema.parse(body);

    const feeStructure = await prisma.paramedicalFeeStructureLabTemplate.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: feeStructure }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await prisma.paramedicalFeeStructureLabTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Fee structure deleted" }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const paramedicalFeeStructureLabSubmissionUpdateSchema = z.object({
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
  applicantName: z.string().optional(),
  applicantContact: z.string().optional(),
  isRead: z.boolean().optional(),
  assignedNotes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const form = await prisma.paramedicalFeeStructureLabSubmission.findUnique({
      where: { id },
    });
    if (!form) {
      return NextResponse.json({ success: false, message: "Form not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: form }, { status: 200 });
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
    const validatedData = paramedicalFeeStructureLabSubmissionUpdateSchema.parse(body);

    const form = await prisma.paramedicalFeeStructureLabSubmission.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: form }, { status: 200 });
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

    await prisma.paramedicalFeeStructureLabSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Form deleted" }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

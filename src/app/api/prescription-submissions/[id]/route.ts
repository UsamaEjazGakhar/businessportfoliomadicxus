import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const prescriptionSubmissionUpdateSchema = z.object({
  doctorName: z.string().optional(),
  doctorQualifications: z.string().optional(),
  pmdcRegNumber: z.string().optional(),
  uidAmb: z.string().optional(),
  timings: z.string().optional(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  date: z.string().optional(),
  rxContent: z.string().optional(),
  adviceContent: z.string().optional(),
  isRead: z.boolean().optional(),
  assignedNotes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR", "CONSULTANT"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const prescription = await prisma.prescriptionSubmission.findUnique({
      where: { id },
    });
    if (!prescription) {
      return NextResponse.json({ success: false, message: "Prescription not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: prescription }, { status: 200 });
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
    const validatedData = prescriptionSubmissionUpdateSchema.parse(body);

    const prescription = await prisma.prescriptionSubmission.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: prescription }, { status: 200 });
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

    const { restore } = await req.json();

    const updated = await prisma.prescriptionSubmission.update({
      where: { id },
      data: {
        isDeleted: !restore,
        deletedAt: restore ? null : new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}


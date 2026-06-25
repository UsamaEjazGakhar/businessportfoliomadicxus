import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const prescriptionSubmissionSchema = z.object({
  doctorName: z.string(),
  doctorQualifications: z.string(),
  pmdcRegNumber: z.string(),
  uidAmb: z.string(),
  timings: z.string(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  date: z.string().optional(),
  rxContent: z.string().optional(),
  adviceContent: z.string().optional(),
  signature: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR", "CONSULTANT"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deleted = searchParams.get('deleted') === 'true';
    const consultantId = searchParams.get('consultantId');

    const prescriptions = await prisma.prescriptionSubmission.findMany({
      where: {
        isDeleted: deleted,
        ...(consultantId && { consultantId }),
      },
      include: {
        consultant: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: prescriptions }, { status: 200 });
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
    const body = await req.json();
    const validatedData = prescriptionSubmissionSchema.parse(body);

    const prescription = await prisma.prescriptionSubmission.create({
      data: {
        ...validatedData,
        consultantId: session?.user?.id,
      },
    });

    return NextResponse.json({ success: true, data: prescription }, { status: 201 });
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { id, restore } = await req.json();

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


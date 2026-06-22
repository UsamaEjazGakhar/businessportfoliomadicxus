import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const admissionFormSubmissionUpdateSchema = z.object({
  instituteName: z.string().optional(),
  instituteAddress: z.string().optional(),
  instituteContact: z.string().optional(),
  applicantName: z.string().optional(),
  fatherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  cnicBFormNumber: z.string().optional(),
  domicileDistrict: z.string().optional(),
  permanentAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  mobileNumber: z.string().optional(),
  photoUrl: z.string().optional(),
  applicantSignatureUrl: z.string().optional(),
  guardianSignatureUrl: z.string().optional(),
  admissionGranted: z.boolean().optional(),
  admissionDenied: z.boolean().optional(),
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
    const form = await prisma.admissionFormSubmission.findUnique({
      where: { id },
      include: { qualifications: true },
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
    const validatedData = admissionFormSubmissionUpdateSchema.parse(body);

    const form = await prisma.admissionFormSubmission.update({
      where: { id },
      data: validatedData,
      include: { qualifications: true },
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

    await prisma.admissionFormSubmission.delete({
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

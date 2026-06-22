import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const admissionFormSubmissionSchema = z.object({
  instituteName: z.string(),
  instituteAddress: z.string(),
  instituteContact: z.string(),
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
});

const qualificationSubmissionSchema = z.object({
  degreeProgram: z.string(),
  scienceOrArts: z.string().optional(),
  totalMarks: z.string().optional(),
  marksObtained: z.string().optional(),
  percentage: z.string().optional(),
  physicsMarks: z.string().optional(),
  chemistryMarks: z.string().optional(),
  biologyMarks: z.string().optional(),
  scienceTotal: z.string().optional(),
  sciencePercentage: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const forms = await prisma.admissionFormSubmission.findMany({
      include: {
        qualifications: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: forms }, { status: 200 });
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
    const body = await req.json();
    const { qualifications, ...formData } = body;
    
    const validatedFormData = admissionFormSubmissionSchema.parse(formData);

    const form = await prisma.admissionFormSubmission.create({
      data: {
        ...validatedFormData,
        qualifications: qualifications ? {
          create: qualifications.map((q: any) => qualificationSubmissionSchema.parse(q)),
        } : undefined,
      },
      include: {
        qualifications: true,
      },
    });

    return NextResponse.json({ success: true, data: form }, { status: 201 });
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const paramedicalFeeStructureLabSubmissionSchema = z.object({
  part1AdmissionFee: z.string(),
  part1MonthlyFee: z.string(),
  part1TotalFee: z.string(),
  part2MonthlyFee: z.string(),
  part2TotalFee: z.string(),
  note: z.string(),
  examFeeNote: z.string(),
  admissionCriteria: z.string(),
  ageLimit: z.string(),
  scholarship: z.string(),
  applicantName: z.string().optional(),
  applicantContact: z.string().optional(),
  isRead: z.boolean().optional(),
  assignedNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const forms = await prisma.paramedicalFeeStructureLabSubmission.findMany({
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
    const validatedData = paramedicalFeeStructureLabSubmissionSchema.parse(body);

    const form = await prisma.paramedicalFeeStructureLabSubmission.create({
      data: validatedData,
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

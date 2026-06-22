import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const nursingFeeSchema = z.object({
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

export async function GET(req: NextRequest) {
  try {
    const feeStructures = await prisma.nursingFeeStructureTemplate.findMany();
    return NextResponse.json({ success: true, data: feeStructures }, { status: 200 });
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
    const validatedData = nursingFeeSchema.parse(body);

    const feeStructure = await prisma.nursingFeeStructureTemplate.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: feeStructure }, { status: 201 });
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const prescriptionSubmissionSchema = z.object({
  doctorName: z.string().optional(),
  doctorQualifications: z.string().optional(),
  pmdcRegNumber: z.string().optional(),
  uidAmb: z.string().optional(),
  timings: z.string().optional(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  date: z.string().optional(),
  visitNumber: z.string().optional(),
  contactCnic: z.string().optional(),
  address: z.string().optional(),
  sonDaughterWifeOf: z.string().optional(),
  weight: z.string().optional(),
  vco: z.string().optional(),
  bp: z.string().optional(),
  pulse: z.string().optional(),
  temp: z.string().optional(),
  spo2: z.string().optional(),
  bsr: z.string().optional(),
  presentingComplaint: z.string().optional(),
  abdomen: z.string().optional(),
  resp: z.string().optional(),
  cvs: z.string().optional(),
  cns: z.string().optional(),
  otherFindings: z.string().optional(),
  htn: z.string().optional(),
  dm: z.string().optional(),
  hepatitis: z.string().optional(),
  kd: z.string().optional(),
  allergy: z.string().optional(),
  addiction: z.string().optional(),
  prevMed: z.string().optional(),
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
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR", "CONSULTANT"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const validatedData = prescriptionSubmissionSchema.parse(body);

    const prescription = await prisma.prescriptionSubmission.create({
      data: {
        doctorName: validatedData.doctorName ?? '',
        doctorQualifications: validatedData.doctorQualifications ?? '',
        pmdcRegNumber: validatedData.pmdcRegNumber ?? '',
        uidAmb: validatedData.uidAmb ?? '',
        timings: validatedData.timings ?? '',

        patientName: validatedData.patientName ?? null,
        patientAge: validatedData.patientAge ?? null,
        patientGender: validatedData.patientGender ?? null,
        date: validatedData.date ?? null,
        visitNumber: validatedData.visitNumber ?? null,
        contactCnic: validatedData.contactCnic ?? null,
        address: validatedData.address ?? null,
        sonDaughterWifeOf: validatedData.sonDaughterWifeOf ?? null,
        weight: validatedData.weight ?? null,
        vco: validatedData.vco ?? null,
        bp: validatedData.bp ?? null,
        pulse: validatedData.pulse ?? null,
        temp: validatedData.temp ?? null,
        spo2: validatedData.spo2 ?? null,
        bsr: validatedData.bsr ?? null,
        presentingComplaint: validatedData.presentingComplaint ?? null,
        abdomen: validatedData.abdomen ?? null,
        resp: validatedData.resp ?? null,
        cvs: validatedData.cvs ?? null,
        cns: validatedData.cns ?? null,
        otherFindings: validatedData.otherFindings ?? null,
        htn: validatedData.htn ?? null,
        dm: validatedData.dm ?? null,
        hepatitis: validatedData.hepatitis ?? null,
        kd: validatedData.kd ?? null,
        allergy: validatedData.allergy ?? null,
        addiction: validatedData.addiction ?? null,
        prevMed: validatedData.prevMed ?? null,
        rxContent: validatedData.rxContent ?? null,
        adviceContent: validatedData.adviceContent ?? null,
        signature: validatedData.signature ?? null,
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
    if (!session || !["SUPER_ADMIN", "EDITOR", "CONSULTANT"].includes(session.user.role)) {
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "CONSULTANT"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { id, action } = await req.json();
    
    if (action === "submitToAdmin") {
      const updated = await prisma.prescriptionSubmission.update({
        where: { id },
        data: {
          submittedToAdmin: true,
          submittedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

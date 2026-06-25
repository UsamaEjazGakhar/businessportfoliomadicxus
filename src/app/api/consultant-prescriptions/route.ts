import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const consultantId = searchParams.get('consultantId');
    const deleted = searchParams.get('deleted') === 'true';
    
    let prescriptions;
    if (consultantId && session.user.role !== Role.CONSULTANT) {
      prescriptions = await prisma.prescriptionSubmission.findMany({
        where: { consultantId, isDeleted: deleted },
        orderBy: { createdAt: "desc" },
        include: { consultant: true },
      });
    } else if (session.user.role === Role.CONSULTANT) {
      prescriptions = await prisma.prescriptionSubmission.findMany({
        where: { consultantId: session.user.id, isDeleted: deleted },
        orderBy: { createdAt: "desc" },
        include: { consultant: true },
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: prescriptions }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

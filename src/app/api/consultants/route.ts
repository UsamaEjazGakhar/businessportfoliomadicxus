import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Role, ApprovalStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "EDITOR", "AUDITOR"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deleted = searchParams.get('deleted') === 'true';

    const consultants = await prisma.user.findMany({
      where: { 
        role: Role.CONSULTANT,
        isDeleted: deleted,
      },
      include: { _count: { select: { prescriptionSubmissions: { where: { isDeleted: false } } } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: consultants }, { status: 200 });
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
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, approvalStatus } = await req.json();

    const updatedConsultant = await prisma.user.update({
      where: { id },
      data: { approvalStatus },
    });

    return NextResponse.json({ success: true, data: updatedConsultant }, { status: 200 });
  } catch (error) {
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
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, restore, permanent } = await req.json();

    if (permanent) {
      // First, delete all related records (audit logs, prescription submissions)
      await prisma.auditLog.deleteMany({ where: { userId: id } });
      await prisma.prescriptionSubmission.deleteMany({ where: { consultantId: id } });
      
      // Now delete the user
      await prisma.user.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: "Consultant permanently deleted" }, { status: 200 });
    } else {
      const updatedConsultant = await prisma.user.update({
        where: { id },
        data: { 
          isDeleted: !restore,
          deletedAt: restore ? null : new Date(),
        },
      });
      return NextResponse.json({ success: true, data: updatedConsultant }, { status: 200 });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errMsg },
      { status: 500 }
    );
  }
}

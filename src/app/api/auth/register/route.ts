import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, ApprovalStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Register body:", body);
    const { username, password, email, name, location, isConsultant } = body ?? {};

    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { error: "username, password, email, name are required" },
        { status: 400 }
      );
    }

    // Force CONSULTANT role
    const role = Role.CONSULTANT;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists (username or email)" },
        { status: 409 }
      );
    }

    console.log("Hashing password...");
    const hashed = await bcrypt.hash(password, 12);
    console.log("Creating user...");

    const user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        location,
        password: hashed,
        role: role,
        approvalStatus: ApprovalStatus.PENDING,
      },
      select: { id: true, username: true, email: true, name: true, role: true, location: true, approvalStatus: true },
    });

    console.log("User created:", user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


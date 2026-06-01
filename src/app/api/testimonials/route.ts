import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const testimonialSchema = z.object({
  authorName: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  company: z.string().max(100).optional().nullable(),
  content: z.string().min(5),
  rating: z.number().int().min(1).max(5).optional(),
  avatarUrl: z.string().max(512).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all"); // If "all" is true and user is admin, show all

    let testimonials;
    if (all === "true") {
      testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      testimonials = await prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ success: true, data: testimonials }, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        ...validatedData,
        isApproved: false, // Must be approved by admin
      },
    });

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { createShowcauseSchema } from "@/lib/validations/showcause";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createShowcauseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Showcause.findOne({
      hospitalId: parsed.data.hospitalId,
      submittedAt: parsed.data.submittedAt,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Duplicate submission" },
        { status: 409 }
      );
    }

    const showcause = await Showcause.create({
      ...parsed.data,
      status: "NEW",
      auditLog: [
        {
          action: "CREATED",
          note: "Submitted via dashboard",
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json(showcause, { status: 201 });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

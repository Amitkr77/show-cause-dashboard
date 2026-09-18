import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { createShowcauseSchema } from "@/lib/validations/showcause";
import { verifyApiKey } from "@/lib/api-key";

export async function POST(request: Request) {
  if (!verifyApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    // Check for duplicate
    const existing = await Showcause.findOne({
      hospitalId: parsed.data.hospitalId,
      submittedAt: parsed.data.submittedAt,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Duplicate submission", existingId: existing._id },
        { status: 409 }
      );
    }

    const showcause = await Showcause.create({
      ...parsed.data,
      status: "NEW",
      auditLog: [
        {
          action: "CREATED",
          note: "Submitted via Google Form",
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json(showcause, { status: 201 });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

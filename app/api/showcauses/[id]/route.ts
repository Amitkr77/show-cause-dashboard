import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { updateShowcauseSchema } from "@/lib/validations/showcause";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const showcause = await Showcause.findById(id).lean();

    if (!showcause) {
      return NextResponse.json(
        { error: "Show cause not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(showcause);
  } catch (error) {
    console.error("Get showcause error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateShowcauseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const showcause = await Showcause.findById(id);
    if (!showcause) {
      return NextResponse.json(
        { error: "Show cause not found" },
        { status: 404 }
      );
    }

    const auditAction = parsed.data.status ? "STATUS_CHANGED" : "UPDATED";
    const auditNote =
      parsed.data.auditNote ||
      (parsed.data.status
        ? `Status changed from ${showcause.status} to ${parsed.data.status}`
        : "Record updated");

    if (parsed.data.status) showcause.status = parsed.data.status;
    if (parsed.data.remarks) showcause.remarks = parsed.data.remarks;

    showcause.auditLog.push({
      action: auditAction,
      note: auditNote,
      timestamp: new Date(),
    });

    await showcause.save();
    return NextResponse.json(showcause);
  } catch (error) {
    console.error("Update showcause error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

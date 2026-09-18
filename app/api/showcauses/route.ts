import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { showcauseQuerySchema } from "@/lib/validations/showcause";
import { buildMongoFilter } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = showcauseQuerySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, sortBy, sortOrder, ...filterParams } = parsed.data;
    const filter = buildMongoFilter(filterParams);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Showcause.find(filter)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Showcause.countDocuments(filter),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List showcauses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

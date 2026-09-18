import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { showcauseQuerySchema } from "@/lib/validations/showcause";
import { buildMongoFilter } from "@/lib/utils";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = showcauseQuerySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { sortBy, sortOrder, ...filterParams } = parsed.data;
    const filter = buildMongoFilter(filterParams);

    const data = await Showcause.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .limit(10000)
      .lean();

    const headers = [
      "Hospital Name",
      "Hospital ID",
      "District",
      "Block/Taluka",
      "Remarks",
      "Required Documents",
      "Action Taken",
      "Status",
      "Submitted At",
      "Created At",
    ];

    const rows = data.map((row) => {
      const r = row as Record<string, unknown>;
      return [
        escapeCsvField(String(r.hospitalName || "")),
        escapeCsvField(String(r.hospitalId || "")),
        escapeCsvField(String(r.district || "")),
        escapeCsvField(String(r.blockTaluka || "")),
        escapeCsvField(String(r.remarks || "")),
        escapeCsvField(
          Array.isArray(r.requiredDocuments)
            ? r.requiredDocuments.join("; ")
            : ""
        ),
        escapeCsvField(String(r.actionTaken || "")),
        escapeCsvField(String(r.status || "")),
        r.submittedAt ? new Date(r.submittedAt as string).toISOString() : "",
        r.createdAt ? new Date(r.createdAt as string).toISOString() : "",
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=showcauses-export-${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

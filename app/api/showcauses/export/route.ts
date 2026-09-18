import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";
import { showcauseQuerySchema } from "@/lib/validations/showcause";
import { buildMongoFilter } from "@/lib/utils";
import { ACTION_LABELS, STATUS_LABELS } from "@/lib/constants";
import * as XLSX from "xlsx";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const HEADERS = [
  "Hospital Name",
  "Hospital ID",
  "District",
  "Remarks",
  "Required Documents",
  "Action Taken",
  "Status",
  "Submitted At",
  "Created At",
];

function toRow(r: Record<string, unknown>) {
  return [
    String(r.hospitalName || ""),
    String(r.hospitalId || ""),
    String(r.district || ""),
    String(r.remarks || ""),
    Array.isArray(r.requiredDocuments) ? r.requiredDocuments.join("; ") : "",
    ACTION_LABELS[String(r.actionTaken)] || String(r.actionTaken || ""),
    STATUS_LABELS[String(r.status)] || String(r.status || ""),
    r.submittedAt ? new Date(r.submittedAt as string).toISOString() : "",
    r.createdAt ? new Date(r.createdAt as string).toISOString() : "",
  ];
}

async function fetchData(request: NextRequest) {
  await connectDB();

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = showcauseQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return null;
  }

  const { sortBy, sortOrder, ...filterParams } = parsed.data;
  const filter = buildMongoFilter(filterParams);

  return Showcause.find(filter)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .limit(10000)
    .lean();
}

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") || "csv";
    const data = await fetchData(request);

    if (!data) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const rows = data.map((row) => toRow(row as Record<string, unknown>));
    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);

      // Column widths
      ws["!cols"] = HEADERS.map((h) => ({
        wch: Math.max(h.length, 18),
      }));

      XLSX.utils.book_append_sheet(wb, ws, "Show Causes");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(buf, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=showcauses-export-${dateStr}.xlsx`,
        },
      });
    }

    if (format === "json") {
      const jsonData = data.map((row) => {
        const r = row as Record<string, unknown>;
        return {
          hospitalName: r.hospitalName,
          hospitalId: r.hospitalId,
          district: r.district,
          remarks: r.remarks,
          requiredDocuments: r.requiredDocuments,
          actionTaken:
            ACTION_LABELS[String(r.actionTaken)] || r.actionTaken,
          status: STATUS_LABELS[String(r.status)] || r.status,
          submittedAt: r.submittedAt,
          createdAt: r.createdAt,
        };
      });

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename=showcauses-export-${dateStr}.json`,
        },
      });
    }

    // Default: CSV
    const csvRows = rows.map((row) =>
      row.map((cell) => escapeCsvField(cell)).join(",")
    );
    const csv = [HEADERS.join(","), ...csvRows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=showcauses-export-${dateStr}.csv`,
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

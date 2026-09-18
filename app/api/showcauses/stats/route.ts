import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Showcause from "@/lib/models/showcause";

export async function GET() {
  try {
    await connectDB();

    const [total, byStatusAgg, byDistrictAgg, byActionAgg, dailyTrendAgg] =
      await Promise.all([
        Showcause.countDocuments(),
        Showcause.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Showcause.aggregate([
          { $group: { _id: "$district", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),
        Showcause.aggregate([
          { $group: { _id: "$actionTaken", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Showcause.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const byStatus: Record<string, number> = {
      NEW: 0,
      UNDER_REVIEW: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    byStatusAgg.forEach(
      (item: { _id: string; count: number }) =>
        (byStatus[item._id] = item.count)
    );

    const byDistrict = byDistrictAgg.map(
      (item: { _id: string; count: number }) => ({
        district: item._id,
        count: item.count,
      })
    );

    const byAction = byActionAgg.map(
      (item: { _id: string; count: number }) => ({
        action: item._id,
        count: item.count,
      })
    );

    const dailyTrend = dailyTrendAgg.map(
      (item: { _id: string; count: number }) => ({
        date: item._id,
        count: item.count,
      })
    );

    return NextResponse.json({
      total,
      byStatus,
      byDistrict,
      byAction,
      dailyTrend,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

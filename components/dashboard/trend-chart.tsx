"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">30-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = (data?.dailyTrend ?? []).map((item) => ({
    date: item.date.slice(5),
    count: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">30-Day Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 text-muted-foreground text-sm">
          No data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">30-Day Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ left: -15, right: 5, top: 5 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8725C" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E8725C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
            <XAxis
              dataKey="date"
              fontSize={11}
              tick={{ fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={11}
              tick={{ fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                fontSize: "13px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#E8725C"
              strokeWidth={2.5}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

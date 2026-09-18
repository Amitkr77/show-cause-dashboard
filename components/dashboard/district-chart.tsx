"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DistrictChart() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">By District</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.byDistrict ?? [];

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">By District</CardTitle>
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
        <CardTitle className="text-sm font-semibold text-foreground">By District</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ bottom: 40, left: -15 }}>
            <defs>
              <linearGradient id="districtGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8DEF" />
                <stop offset="100%" stopColor="#5B8DEF" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
            <XAxis
              dataKey="district"
              angle={-35}
              textAnchor="end"
              fontSize={11}
              interval={0}
              tick={{ dy: 5, fill: "#71717a" }}
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
            <Bar
              dataKey="count"
              fill="url(#districtGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

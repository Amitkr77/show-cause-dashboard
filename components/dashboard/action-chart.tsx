"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";
import { ACTION_LABELS } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ACTION_COLORS = [
  "#E8725C", "#5B8DEF", "#F4B942", "#7C6CF0",
  "#34C38F", "#F97066", "#06B6D4", "#EC4899",
];

export default function ActionChart() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Actions Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = (data?.byAction ?? []).map((item, i) => ({
    name: ACTION_LABELS[item.action] || item.action,
    count: item.count,
    fill: ACTION_COLORS[i % ACTION_COLORS.length],
  }));

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Actions Taken</CardTitle>
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
        <CardTitle className="text-sm font-semibold text-foreground">Actions Taken</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              fontSize={11}
              tick={{ fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={110}
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
            <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

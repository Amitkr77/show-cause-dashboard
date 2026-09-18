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
} from "recharts";

const ACTION_COLORS = [
  "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6",
  "#10b981", "#f97316", "#06b6d4", "#ec4899",
];

export default function ActionChart() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Actions Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-lg" />
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
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Actions Taken</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
          No data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Actions Taken</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" allowDecimals={false} fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              dataKey="name"
              type="category"
              width={110}
              fontSize={11}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {chartData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

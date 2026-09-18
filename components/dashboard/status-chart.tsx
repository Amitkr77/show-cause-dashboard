"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function StatusChart() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-55 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(data?.byStatus ?? {})
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      status,
    }));

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-55 text-muted-foreground text-sm">
          No data yet
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                strokeWidth={3}
                stroke="#ffffff"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} (${Math.round((Number(value) / total) * 100)}%)`, "Count"]}
                contentStyle={{ borderRadius: "12px", fontSize: "13px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {chartData.map((entry) => (
              <div key={entry.status} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[entry.status] }}
                />
                <span className="text-muted-foreground text-xs">{entry.name}</span>
                <span className="font-semibold text-xs">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";

const statConfig = [
  { key: "total" as const, label: "Total Notices", color: "text-blue-600", bg: "bg-blue-50" },
  { key: "NEW" as const, label: "New", color: "text-amber-600", bg: "bg-amber-50" },
  { key: "UNDER_REVIEW" as const, label: "Under Review", color: "text-purple-600", bg: "bg-purple-50" },
  { key: "RESOLVED" as const, label: "Resolved", color: "text-green-600", bg: "bg-green-50" },
];

export default function StatsCards() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((stat) => {
        const value =
          stat.key === "total"
            ? data?.total ?? 0
            : data?.byStatus?.[stat.key] ?? 0;

        return (
          <Card key={stat.key} className={stat.bg}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${stat.color}`}>{value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

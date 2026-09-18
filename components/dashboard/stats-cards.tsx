"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-stats";

const statConfig = [
  {
    key: "total" as const,
    label: "Total Notices",
    accent: "#E8725C",
    bgAccent: "bg-[#E8725C]/10",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    key: "NEW" as const,
    label: "New",
    accent: "#F4B942",
    bgAccent: "bg-[#F4B942]/10",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    key: "UNDER_REVIEW" as const,
    label: "Under Review",
    accent: "#7C6CF0",
    bgAccent: "bg-[#7C6CF0]/10",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    key: "RESOLVED" as const,
    label: "Resolved",
    accent: "#34C38F",
    bgAccent: "bg-[#34C38F]/10",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function StatsCards() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-30 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {statConfig.map((stat) => {
        const value =
          stat.key === "total"
            ? data?.total ?? 0
            : data?.byStatus?.[stat.key] ?? 0;

        return (
          <Card
            key={stat.key}
            className="bg-card border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight" style={{ color: stat.accent }}>
                    {value}
                  </p>
                </div>
                <div className={`${stat.bgAccent} rounded-xl p-2.5`} style={{ color: stat.accent }}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

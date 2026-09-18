"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowcauses } from "@/hooks/use-showcauses";
import { formatDate } from "@/lib/utils";
import { ACTION_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { ShowcauseStatus } from "@/types";

const statusStyles: Record<ShowcauseStatus, string> = {
  NEW: "bg-[#F4B942]/15 text-[#B8860B] hover:bg-[#F4B942]/15",
  UNDER_REVIEW: "bg-[#7C6CF0]/15 text-[#5B4CC0] hover:bg-[#7C6CF0]/15",
  RESOLVED: "bg-[#34C38F]/15 text-[#1D8A5F] hover:bg-[#34C38F]/15",
  CLOSED: "bg-gray-100 text-gray-500 hover:bg-gray-100",
};

export default function RecentSubmissions() {
  const { data, isLoading } = useShowcauses({
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-semibold text-foreground">
          Recent Submissions
        </CardTitle>
        <Link
          href="/showcauses"
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <p className="text-center py-12 text-muted-foreground text-sm">
            No submissions yet
          </p>
        ) : (
          <div className="space-y-2">
            {data.data.map((item) => (
              <Link
                key={item._id}
                href={`/showcauses/${item._id}`}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {item.hospitalName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.district} · {ACTION_LABELS[item.actionTaken] || item.actionTaken} · {formatDate(item.submittedAt)}
                  </p>
                </div>
                <Badge className={`ml-3 shrink-0 text-[11px] font-medium border-0 ${statusStyles[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

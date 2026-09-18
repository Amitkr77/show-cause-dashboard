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
  NEW: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  UNDER_REVIEW: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  RESOLVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CLOSED: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

export default function RecentSubmissions() {
  const { data, isLoading } = useShowcauses({
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Submissions
        </CardTitle>
        <Link
          href="/showcauses"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <p className="text-center py-10 text-muted-foreground text-sm">
            No submissions yet
          </p>
        ) : (
          <div className="space-y-2">
            {data.data.map((item) => (
              <Link
                key={item._id}
                href={`/showcauses/${item._id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                    {item.hospitalName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.district} · {ACTION_LABELS[item.actionTaken] || item.actionTaken} · {formatDate(item.submittedAt)}
                  </p>
                </div>
                <Badge className={`ml-3 shrink-0 text-xs font-medium ${statusStyles[item.status]}`}>
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

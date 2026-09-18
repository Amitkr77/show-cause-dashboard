"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowcauses } from "@/hooks/use-showcauses";
import { formatDate } from "@/lib/utils";
import type { ShowcauseStatus } from "@/types";

const statusVariant: Record<ShowcauseStatus, "default" | "secondary" | "destructive" | "outline"> = {
  NEW: "default",
  UNDER_REVIEW: "secondary",
  RESOLVED: "outline",
  CLOSED: "outline",
};

const statusLabel: Record<ShowcauseStatus, string> = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export default function RecentSubmissions() {
  const { data, isLoading } = useShowcauses({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Submissions</CardTitle>
        <Link
          href="/showcauses"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <p className="text-center py-8 text-muted-foreground">
            No submissions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Link
                        href={`/showcauses/${item._id}`}
                        className="hover:underline font-medium"
                      >
                        {item.hospitalName}
                      </Link>
                    </TableCell>
                    <TableCell>{item.district}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[item.status]}>
                        {statusLabel[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

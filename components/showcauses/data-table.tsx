"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { Showcause, ShowcauseStatus } from "@/types";

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

interface DataTableProps {
  data: Showcause[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function DataTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
}: DataTableProps) {
  const SortHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortBy === field && (
          <span className="text-xs">{sortOrder === "asc" ? " ↑" : " ↓"}</span>
        )}
      </span>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No show cause notices found
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader field="hospitalName">Hospital</SortHeader>
              <TableHead>Hospital ID</TableHead>
              <SortHeader field="district">District</SortHeader>
              <TableHead>Block</TableHead>
              <SortHeader field="status">Status</SortHeader>
              <TableHead>Action Taken</TableHead>
              <SortHeader field="submittedAt">Submitted</SortHeader>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  {item.hospitalName}
                </TableCell>
                <TableCell>{item.hospitalId}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.blockTaluka}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[item.status]}>
                    {statusLabel[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {item.actionTaken}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.submittedAt)}
                </TableCell>
                <TableCell>
                  <Link href={`/showcauses/${item._id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

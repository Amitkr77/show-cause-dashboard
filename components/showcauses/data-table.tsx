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
import { ACTION_LABELS } from "@/lib/constants";
import { STATUS_LABELS } from "@/lib/constants";
import type { Showcause, ShowcauseStatus } from "@/types";

const statusStyles: Record<ShowcauseStatus, string> = {
  NEW: "bg-amber-100 text-amber-700",
  UNDER_REVIEW: "bg-violet-100 text-violet-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-600",
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
    className,
  }: {
    field: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer select-none hover:text-foreground ${className || ""}`}
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
              <TableHead className="hidden md:table-cell">Hospital ID</TableHead>
              <SortHeader field="district" className="hidden sm:table-cell">District</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <TableHead className="hidden lg:table-cell">Action Taken</TableHead>
              <SortHeader field="submittedAt" className="hidden sm:table-cell">Submitted</SortHeader>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="font-medium">{item.hospitalName}</div>
                  <div className="text-xs text-muted-foreground sm:hidden">
                    {item.district} &middot; {formatDate(item.submittedAt)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.hospitalId}</TableCell>
                <TableCell className="hidden sm:table-cell">{item.district}</TableCell>
                <TableCell>
                  <Badge className={`text-xs font-medium ${statusStyles[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                  {ACTION_LABELS[item.actionTaken] || item.actionTaken}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
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
              {pagination.page} / {pagination.totalPages}
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

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
  NEW: "bg-[#F4B942]/15 text-[#B8860B]",
  UNDER_REVIEW: "bg-[#7C6CF0]/15 text-[#5B4CC0]",
  RESOLVED: "bg-[#34C38F]/15 text-[#1D8A5F]",
  CLOSED: "bg-gray-100 text-gray-500",
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
      className={`cursor-pointer select-none hover:text-foreground transition-colors ${className || ""}`}
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
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No show cause notices found
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border-0 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
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
              <TableRow key={item._id} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                <TableCell>
                  <div className="font-medium">{item.hospitalName}</div>
                  <div className="text-xs text-muted-foreground sm:hidden mt-0.5">
                    {item.district} · {formatDate(item.submittedAt)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{item.hospitalId}</TableCell>
                <TableCell className="hidden sm:table-cell">{item.district}</TableCell>
                <TableCell>
                  <Badge className={`text-[11px] font-medium border-0 ${statusStyles[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-muted-foreground">
                  {ACTION_LABELS[item.actionTaken] || item.actionTaken}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatDate(item.submittedAt)}
                </TableCell>
                <TableCell>
                  <Link href={`/showcauses/${item._id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
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
              className="rounded-xl"
            >
              Previous
            </Button>
            <span className="text-sm font-medium px-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

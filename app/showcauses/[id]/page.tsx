"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowcause } from "@/hooks/use-showcause";
import DetailCard from "@/components/showcause-detail/detail-card";
import StatusUpdateForm from "@/components/showcause-detail/status-update-form";
import AuditLogTimeline from "@/components/showcause-detail/audit-log-timeline";

export default function ShowcauseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error, mutate } = useShowcause(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data || !data._id) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Show cause notice not found</p>
        <Link href="/showcauses">
          <Button variant="outline">Back to list</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/showcauses">
          <Button variant="outline" size="sm" className="rounded-xl">
            ← Back
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Show Cause Detail</h1>
      </div>

      <DetailCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusUpdateForm
          currentStatus={data.status}
          showcauseId={data._id}
          onUpdated={() => mutate()}
        />
        <AuditLogTimeline entries={data.auditLog || []} />
      </div>
    </div>
  );
}

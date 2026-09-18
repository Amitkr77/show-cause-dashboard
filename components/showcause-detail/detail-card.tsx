"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { ACTION_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { Showcause, ShowcauseStatus } from "@/types";

const statusStyles: Record<ShowcauseStatus, string> = {
  NEW: "bg-[#F4B942]/15 text-[#B8860B]",
  UNDER_REVIEW: "bg-[#7C6CF0]/15 text-[#5B4CC0]",
  RESOLVED: "bg-[#34C38F]/15 text-[#1D8A5F]",
  CLOSED: "bg-gray-100 text-gray-500",
};

interface DetailCardProps {
  data: Showcause;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-medium mt-1 break-words">{value || "-"}</p>
    </div>
  );
}

export default function DetailCard({ data }: DetailCardProps) {
  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl tracking-tight break-words">{data.hospitalName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1.5">
              ID: {data.hospitalId}
            </p>
          </div>
          <Badge className={`text-sm font-medium border-0 px-3 py-1 ${statusStyles[data.status]}`}>
            {STATUS_LABELS[data.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="District" value={data.district} />
          <Field label="Submitted At" value={formatDate(data.submittedAt)} />
        </div>
        <Separator className="bg-border/50" />
        <Field label="Remarks" value={data.remarks} />
        <Field label="Action Taken" value={ACTION_LABELS[data.actionTaken] || data.actionTaken} />
        {data.requiredDocuments.length > 0 && (
          <Field
            label="Required Documents"
            value={data.requiredDocuments.join(", ")}
          />
        )}
        <Separator className="bg-border/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Created At" value={formatDate(data.createdAt)} />
          <Field label="Last Updated" value={formatDate(data.updatedAt)} />
          {data.sourceId && <Field label="Source ID" value={data.sourceId} />}
        </div>
      </CardContent>
    </Card>
  );
}

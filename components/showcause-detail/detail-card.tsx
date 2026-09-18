"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { ACTION_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { Showcause, ShowcauseStatus } from "@/types";

const statusStyles: Record<ShowcauseStatus, string> = {
  NEW: "bg-amber-100 text-amber-700",
  UNDER_REVIEW: "bg-violet-100 text-violet-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

interface DetailCardProps {
  data: Showcause;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5 break-words">{value || "-"}</p>
    </div>
  );
}

export default function DetailCard({ data }: DetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl break-words">{data.hospitalName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {data.hospitalId}
            </p>
          </div>
          <Badge className={`text-sm font-medium ${statusStyles[data.status]}`}>
            {STATUS_LABELS[data.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="District" value={data.district} />
          <Field label="Submitted At" value={formatDate(data.submittedAt)} />
        </div>
        <Separator />
        <Field label="Remarks" value={data.remarks} />
        <Field label="Action Taken" value={ACTION_LABELS[data.actionTaken] || data.actionTaken} />
        {data.requiredDocuments.length > 0 && (
          <Field
            label="Required Documents"
            value={data.requiredDocuments.join(", ")}
          />
        )}
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Created At" value={formatDate(data.createdAt)} />
          <Field label="Last Updated" value={formatDate(data.updatedAt)} />
          {data.sourceId && <Field label="Source ID" value={data.sourceId} />}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { AuditEntry } from "@/types";

interface AuditLogTimelineProps {
  entries: AuditEntry[];
}

export default function AuditLogTimeline({ entries }: AuditLogTimelineProps) {
  const sorted = [...entries].reverse();

  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No audit entries yet</p>
        ) : (
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border/60" />
            {sorted.map((entry, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-primary border-2 border-card" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Badge variant="secondary" className="text-xs truncate max-w-[150px] sm:max-w-none rounded-lg">
                      {entry.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground break-words">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

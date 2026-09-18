"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ShowcauseStatus } from "@/types";

interface StatusUpdateFormProps {
  currentStatus: ShowcauseStatus;
  showcauseId: string;
  onUpdated: () => void;
}

export default function StatusUpdateForm({
  currentStatus,
  showcauseId,
  onUpdated,
}: StatusUpdateFormProps) {
  const [status, setStatus] = useState<ShowcauseStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/showcauses/${showcauseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          auditNote: note,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }

      setMessage({ type: "success", text: "Updated successfully" });
      setNote("");
      onUpdated();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as ShowcauseStatus)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Note</label>
            <Textarea
              placeholder="Add a note for the audit log..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-xl">
            {loading ? "Updating..." : "Update"}
          </Button>

          {message && (
            <p
              className={`text-sm text-center ${message.type === "success" ? "text-[#1D8A5F]" : "text-red-600"}`}
            >
              {message.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

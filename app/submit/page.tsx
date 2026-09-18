"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTION_OPTIONS } from "@/lib/constants";

const initialForm = {
  hospitalName: "",
  hospitalId: "",
  district: "",
  remarks: "",
  requiredDocuments: "",
  actionTaken: "",
};

export default function SubmitPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!form.actionTaken) {
      setMessage({ type: "error", text: "Please select an action" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/showcauses/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requiredDocuments: form.requiredDocuments
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setMessage({
        type: "success",
        text: "Show cause notice submitted successfully!",
      });
      setForm(initialForm);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Submission failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Submit Show Cause Notice
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below to submit a new notice</p>
      </div>

      <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Notice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Hospital Name <span className="text-primary">*</span>
                </label>
                <Input
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g. District Hospital Patna"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Hospital ID <span className="text-primary">*</span>
                </label>
                <Input
                  name="hospitalId"
                  value={form.hospitalId}
                  onChange={handleChange}
                  placeholder="e.g. HOS-001"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  District <span className="text-primary">*</span>
                </label>
                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g. Patna"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Action Taken <span className="text-primary">*</span>
                </label>
                <Select
                  value={form.actionTaken}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, actionTaken: val ?? "" }))
                  }
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Remarks <span className="text-primary">*</span>
              </label>
              <Textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Describe the issue..."
                rows={3}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Required Documents{" "}
                <span className="text-muted-foreground text-xs">
                  (optional, comma-separated)
                </span>
              </label>
              <Input
                name="requiredDocuments"
                value={form.requiredDocuments}
                onChange={handleChange}
                placeholder="e.g. Inspection Report, License Copy"
                className="rounded-xl"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl h-11 text-sm font-medium">
              {loading ? "Submitting..." : "Submit Notice"}
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
    </div>
  );
}

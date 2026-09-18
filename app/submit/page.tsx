"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialForm = {
  hospitalName: "",
  hospitalId: "",
  district: "",
  blockTaluka: "",
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

      setMessage({ type: "success", text: "Show cause notice submitted successfully!" });
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
      <h1 className="text-2xl font-bold mb-6">Submit Show Cause Notice</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g. District Hospital Patna"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Hospital ID <span className="text-red-500">*</span>
                </label>
                <Input
                  name="hospitalId"
                  value={form.hospitalId}
                  onChange={handleChange}
                  placeholder="e.g. HOS-001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  District <span className="text-red-500">*</span>
                </label>
                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g. Patna"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Block / Taluka <span className="text-red-500">*</span>
                </label>
                <Input
                  name="blockTaluka"
                  value={form.blockTaluka}
                  onChange={handleChange}
                  placeholder="e.g. Patna Sadar"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Remarks <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Describe the issue..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Required Documents{" "}
                <span className="text-muted-foreground text-xs">(optional, comma-separated)</span>
              </label>
              <Input
                name="requiredDocuments"
                value={form.requiredDocuments}
                onChange={handleChange}
                placeholder="e.g. Inspection Report, License Copy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Action Taken <span className="text-red-500">*</span>
              </label>
              <Input
                name="actionTaken"
                value={form.actionTaken}
                onChange={handleChange}
                placeholder="e.g. Show cause notice issued"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Notice"}
            </Button>

            {message && (
              <p
                className={`text-sm text-center ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
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

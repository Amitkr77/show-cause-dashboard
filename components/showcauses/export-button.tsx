"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ShowcauseFilters } from "@/types";

interface ExportButtonProps {
  filters: ShowcauseFilters;
}

const formats = [
  { value: "csv", label: "CSV" },
  { value: "excel", label: "Excel" },
  { value: "json", label: "JSON" },
];

export default function ExportButton({ filters }: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const handleExport = (format: string) => {
    const params = new URLSearchParams();
    params.set("format", format);
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== "" &&
        key !== "page" &&
        key !== "limit"
      ) {
        params.set(key, String(value));
      }
    });
    window.open(`/api/showcauses/export?${params}`, "_blank");
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
      >
        Export ↓
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-popover border-0 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1 min-w-30">
            {formats.map((f) => (
              <button
                key={f.value}
                onClick={() => handleExport(f.value)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                {f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import type { ShowcauseFilters } from "@/types";

interface ExportButtonProps {
  filters: ShowcauseFilters;
}

export default function ExportButton({ filters }: ExportButtonProps) {
  const handleExport = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "page" && key !== "limit") {
        params.set(key, String(value));
      }
    });
    const url = `/api/showcauses/export${params.toString() ? `?${params}` : ""}`;
    window.open(url, "_blank");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      Export CSV
    </Button>
  );
}

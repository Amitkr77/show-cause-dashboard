"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ShowcauseFilters } from "@/types";

interface FiltersProps {
  filters: ShowcauseFilters;
  onChange: (filters: Partial<ShowcauseFilters>) => void;
  onClear: () => void;
}

export default function Filters({ filters, onChange, onClear }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Status</label>
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) =>
            onChange({ status: val === "ALL" ? "" : (val as ShowcauseFilters["status"]) })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">District</label>
        <Input
          placeholder="District"
          value={filters.district || ""}
          onChange={(e) => onChange({ district: e.target.value })}
          className="w-[160px]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Block</label>
        <Input
          placeholder="Block/Taluka"
          value={filters.blockTaluka || ""}
          onChange={(e) => onChange({ blockTaluka: e.target.value })}
          className="w-[160px]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">From</label>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className="w-[150px]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">To</label>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="w-[150px]"
        />
      </div>

      <Button variant="outline" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}

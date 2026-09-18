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
import { ACTION_OPTIONS } from "@/lib/constants";
import type { ShowcauseFilters } from "@/types";

interface FiltersProps {
  filters: ShowcauseFilters;
  onChange: (filters: Partial<ShowcauseFilters>) => void;
  onClear: () => void;
}

export default function Filters({ filters, onChange, onClear }: FiltersProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Status</label>
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) =>
            onChange({
              status: val === "ALL" ? "" : (val as ShowcauseFilters["status"]),
            })
          }
        >
          <SelectTrigger className="w-full">
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
        <label className="text-xs text-muted-foreground">Action</label>
        <Select
          value={filters.actionTaken || "ALL"}
          onValueChange={(val) =>
            onChange({ actionTaken: val === "ALL" ? "" : val })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            {ACTION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">District</label>
        <Input
          placeholder="District"
          value={filters.district || ""}
          onChange={(e) => onChange({ district: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">From</label>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">To</label>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="w-full"
        />
      </div>

      <Button variant="outline" size="sm" onClick={onClear} className="w-full">
        Clear
      </Button>
    </div>
  );
}

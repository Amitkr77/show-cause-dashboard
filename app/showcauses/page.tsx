"use client";

import { useCallback, useState } from "react";
import { useShowcauses } from "@/hooks/use-showcauses";
import SearchBar from "@/components/showcauses/search-bar";
import Filters from "@/components/showcauses/filters";
import DataTable from "@/components/showcauses/data-table";
import ExportButton from "@/components/showcauses/export-button";
import type { ShowcauseFilters } from "@/types";

const defaultFilters: ShowcauseFilters = {
  search: "",
  status: "",
  actionTaken: "",
  district: "",
  startDate: "",
  endDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 20,
};

export default function ShowcausesPage() {
  const [filters, setFilters] = useState<ShowcauseFilters>(defaultFilters);
  const { data, isLoading } = useShowcauses(filters);

  const handleFilterChange = useCallback(
    (updates: Partial<ShowcauseFilters>) => {
      setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
    },
    []
  );

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Show Cause Notices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all notices</p>
        </div>
        <ExportButton filters={filters} />
      </div>

      <div className="space-y-3">
        <SearchBar value={filters.search || ""} onChange={handleSearchChange} />
        <Filters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClear}
        />
      </div>

      <DataTable
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={data?.pagination ?? null}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onSort={handleSort}
        sortBy={filters.sortBy || "createdAt"}
        sortOrder={filters.sortOrder || "desc"}
      />
    </div>
  );
}

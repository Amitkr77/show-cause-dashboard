import useSWR from "swr";
import type { ShowcauseListResponse, ShowcauseFilters } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function buildQueryString(filters: ShowcauseFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function useShowcauses(filters: ShowcauseFilters = {}) {
  const query = buildQueryString(filters);
  const url = `/api/showcauses${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<ShowcauseListResponse>(
    url,
    fetcher
  );

  return { data, error, isLoading, mutate };
}

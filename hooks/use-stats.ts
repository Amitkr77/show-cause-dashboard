import useSWR from "swr";
import type { StatsResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<StatsResponse>(
    "/api/showcauses/stats",
    fetcher,
    { refreshInterval: 60000 }
  );

  return { data, error, isLoading, mutate };
}

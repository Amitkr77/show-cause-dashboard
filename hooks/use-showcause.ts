import useSWR from "swr";
import type { Showcause } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useShowcause(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Showcause>(
    id ? `/api/showcauses/${id}` : null,
    fetcher
  );

  return { data, error, isLoading, mutate };
}

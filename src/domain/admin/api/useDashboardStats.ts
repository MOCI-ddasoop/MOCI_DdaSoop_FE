"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "./getDashboardStats";

const DASHBOARD_STATS_QUERY_KEY = ["admin", "dashboard", "stats"] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: getDashboardStats,
  });
}

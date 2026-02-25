"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminReportStats } from "./getAdminReportStats";

export function useAdminReportStats() {
  return useQuery({
    queryKey: ["admin", "reports", "stats"],
    queryFn: getAdminReportStats,
  });
}

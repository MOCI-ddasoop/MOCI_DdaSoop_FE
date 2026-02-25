"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminReports } from "./getAdminReports";

export const ADMIN_REPORTS_QUERY_KEY = ["admin", "reports"] as const;

export function useAdminReports(
  params: {
    status?: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
    page?: number;
    size?: number;
  } = {}
) {
  const { status, page = 0, size = 20 } = params;
  return useQuery({
    queryKey: [...ADMIN_REPORTS_QUERY_KEY, status, page, size],
    queryFn: () => getAdminReports({ status, page, size }),
  });
}

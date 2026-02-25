"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminReport } from "./getAdminReport";

export function useAdminReport(reportId: number | null) {
  return useQuery({
    queryKey: ["admin", "reports", reportId],
    queryFn: () => getAdminReport(reportId!),
    enabled: reportId != null,
  });
}

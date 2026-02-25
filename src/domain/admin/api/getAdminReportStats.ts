import { api } from "@/shared/config/api";
import type { AdminReportStatsResponse } from "../types";

/**
 * GET /api/admin/reports/stats - 신고 통계
 */
export async function getAdminReportStats() {
  const { data } = await api.get<AdminReportStatsResponse>(
    "/api/admin/reports/stats"
  );
  return data;
}

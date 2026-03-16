import { api } from "@/shared/config/api";
import type { AdminReportDetailResponse } from "../types";

/**
 * GET /api/admin/reports/{reportId} - 신고 상세
 */
export async function getAdminReport(reportId: number) {
  const { data } = await api.get<AdminReportDetailResponse>(
    `/api/admin/reports/${reportId}`
  );
  return data;
}

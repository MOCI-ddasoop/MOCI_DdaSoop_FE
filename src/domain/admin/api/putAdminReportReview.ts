import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/reports/{reportId}/review - 검토 시작
 */
export async function putAdminReportReview(reportId: number) {
  await api.put(`/api/admin/reports/${reportId}/review`);
}

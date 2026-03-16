import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/reports/{reportId}/process - 신고 처리 (승인/기각)
 */
export async function putAdminReportProcess(
  reportId: number,
  body: { status: "APPROVED" | "REJECTED"; adminComment: string }
) {
  await api.put(`/api/admin/reports/${reportId}/process`, body);
}

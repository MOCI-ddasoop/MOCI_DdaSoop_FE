import { api } from "@/shared/config/api";

/**
 * GET /api/admin/reports/frequent-members - 신고 많은 회원 (memberId 목록)
 */
export async function getAdminReportFrequentMembers(params?: {
  minCount?: number;
  size?: number;
}) {
  const { data } = await api.get<number[]>(
    "/api/admin/reports/frequent-members",
    {
      params: {
        minCount: params?.minCount ?? 5,
        size: params?.size ?? 20,
      },
    }
  );
  return data;
}

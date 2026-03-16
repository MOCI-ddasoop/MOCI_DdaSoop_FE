import { api } from "@/shared/config/api";

/**
 * GET /api/admin/reports/frequent-targets - 신고 많은 콘텐츠 (targetType별 ID 목록)
 */
export async function getAdminReportFrequentTargets(params: {
  type: "FEED" | "COMMENT" | "TOGETHER";
  minCount?: number;
  size?: number;
}) {
  const { data } = await api.get<number[]>(
    "/api/admin/reports/frequent-targets",
    {
      params: {
        type: params.type,
        minCount: params.minCount ?? 10,
        size: params.size ?? 20,
      },
    }
  );
  return data;
}

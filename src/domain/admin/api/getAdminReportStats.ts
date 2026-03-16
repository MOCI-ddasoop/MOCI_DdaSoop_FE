import { api } from "@/shared/config/api";
import type { AdminReportStatsResponse } from "../types";

/** BE가 snake_case로 줄 수 있음 */
type RawReportStats = AdminReportStatsResponse & {
  total_pending?: number;
  feed_pending?: number;
  comment_pending?: number;
  together_pending?: number;
};

/**
 * GET /api/admin/reports/stats - 신고 통계
 * camelCase/snake_case 모두 읽어서 통일된 형태로 반환 (신고 대기 카운트용)
 */
export async function getAdminReportStats(): Promise<AdminReportStatsResponse> {
  const { data } = await api.get<RawReportStats>("/api/admin/reports/stats");
  const raw = data as RawReportStats | undefined;
  const feedP = raw?.feedPending ?? raw?.feed_pending ?? 0;
  const commentP = raw?.commentPending ?? raw?.comment_pending ?? 0;
  const togetherP = raw?.togetherPending ?? raw?.together_pending ?? 0;
  const totalP =
    raw?.totalPending ?? raw?.total_pending ?? (feedP + commentP + togetherP);

  return {
    totalPending: totalP,
    feedPending: raw?.feedPending ?? raw?.feed_pending,
    commentPending: raw?.commentPending ?? raw?.comment_pending,
    togetherPending: raw?.togetherPending ?? raw?.together_pending,
  };
}

import { api } from "@/shared/config/api";
import type { DashboardStatsResponse } from "../types";
import { getAdminReportStats } from "./getAdminReportStats";

/** BE가 camelCase/snake_case 또는 reportStats 내부로 줄 수 있음 */
type RawDashboardStats = DashboardStatsResponse & {
  report_pending_count?: number;
  member_count?: number;
  feed_count?: number;
  comment_count?: number;
  together_count?: number;
  donation_count?: number;
  totalPending?: number;
  reportStats?: {
    totalPending?: number;
    report_pending_count?: number;
  };
};

/**
 * GET /api/admin/dashboard/stats - 대시보드 통계
 * 신고 대기는 여러 필드/경로 시도 후 없으면 GET /api/admin/reports/stats 의 totalPending 사용
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const { data } = await api.get<RawDashboardStats>(
    "/api/admin/dashboard/stats"
  );
  const raw = data as RawDashboardStats | undefined;

  let reportPendingCount =
    raw?.reportPendingCount ??
    raw?.report_pending_count ??
    raw?.totalPending ??
    raw?.reportStats?.totalPending ??
    raw?.reportStats?.report_pending_count;

  if (reportPendingCount == null) {
    try {
      const reportStats = await getAdminReportStats();
      reportPendingCount =
        reportStats?.totalPending ??
        (reportStats?.feedPending ?? 0) +
          (reportStats?.commentPending ?? 0) +
          (reportStats?.togetherPending ?? 0);
    } catch {
      reportPendingCount = undefined;
    }
  }

  return {
    memberCount: raw?.memberCount ?? raw?.member_count,
    feedCount: raw?.feedCount ?? raw?.feed_count,
    commentCount: raw?.commentCount ?? raw?.comment_count,
    togetherCount: raw?.togetherCount ?? raw?.together_count,
    donationCount: raw?.donationCount ?? raw?.donation_count,
    reportPendingCount,
  };
}

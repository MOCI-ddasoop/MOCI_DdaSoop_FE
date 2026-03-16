import { api } from "@/shared/config/api";
import type { AdminFeedListResponse } from "../types";

type GetAdminFeedsParams = {
  visibility?: string;
  authorId?: number;
  reportedOnly?: boolean;
  page?: number;
  size?: number;
};

/**
 * GET /api/admin/feeds - 관리자 피드 목록
 */
export async function getAdminFeeds(params: GetAdminFeedsParams) {
  const { visibility, authorId, reportedOnly, page = 0, size = 20 } = params;

  const query: Record<string, unknown> = {
    page,
    size,
  };

  if (visibility && visibility !== "ALL") {
    query.visibility = visibility;
  }

  if (authorId) {
    query.authorId = authorId;
  }

  if (reportedOnly) {
    query.reportedOnly = true;
  }

  const { data } = await api.get<AdminFeedListResponse>("/api/admin/feeds", {
    params: query,
  });

  return data;
}


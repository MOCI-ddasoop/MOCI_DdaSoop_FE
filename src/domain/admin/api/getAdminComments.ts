import { api } from "@/shared/config/api";
import type { AdminCommentListResponse } from "../types";

type GetAdminCommentsParams = {
  commentType?: string;
  authorId?: number;
  reportedOnly?: boolean;
  page?: number;
  size?: number;
};

/**
 * GET /api/admin/comments - 관리자 댓글 목록
 */
export async function getAdminComments(params: GetAdminCommentsParams) {
  const { commentType, authorId, reportedOnly, page = 0, size = 20 } = params;

  const query: Record<string, unknown> = {
    page,
    size,
  };

  if (commentType && commentType !== "ALL") {
    query.commentType = commentType;
  }

  if (authorId) {
    query.authorId = authorId;
  }

  if (reportedOnly) {
    query.reportedOnly = true;
  }

  const { data } = await api.get<AdminCommentListResponse>("/api/admin/comments", {
    params: query,
  });

  return data;
}


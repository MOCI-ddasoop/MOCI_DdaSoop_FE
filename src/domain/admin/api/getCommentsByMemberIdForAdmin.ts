import { api } from "@/shared/config/api";

/** GET /api/comments/members/{memberId} 응답 항목 (관리자용) */
export interface CommentItemForAdmin {
  id?: number;
  content?: string;
  authorNickname?: string;
  authorName?: string;
  targetId?: number;
  createdAt?: string;
}

export interface CommentPageForAdmin {
  content?: CommentItemForAdmin[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
  size?: number;
}

/**
 * 작성자 ID로 댓글 목록 조회 (일반 API)
 */
export async function getCommentsByMemberIdForAdmin(
  memberId: number,
  params?: { page?: number; size?: number }
) {
  const { data } = await api.get<CommentPageForAdmin>(
    `/api/comments/members/${memberId}`,
    { params: { page: params?.page ?? 0, size: params?.size ?? 50 } }
  );
  return data;
}

import { api } from "@/shared/config/api";

/** 관리자 페이지에서 댓글 정보 표시용 (일반 API GET /api/comments/{commentId}) */
export interface CommentInfoForAdmin {
  id?: number;
  content?: string;
  authorNickname?: string;
  authorName?: string;
  targetId?: number;
  createdAt?: string;
}

export async function getCommentByIdForAdmin(commentId: number) {
  const { data } = await api.get<CommentInfoForAdmin>(
    `/api/comments/${commentId}`
  );
  return data;
}

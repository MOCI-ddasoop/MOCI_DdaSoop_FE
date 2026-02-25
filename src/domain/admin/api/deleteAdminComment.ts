import { api } from "@/shared/config/api";

/**
 * DELETE /api/admin/comments/{commentId} - 댓글 강제 삭제
 */
export async function deleteAdminComment(commentId: number) {
  await api.delete(`/api/admin/comments/${commentId}`);
}

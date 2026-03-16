import { api } from "@/shared/config/api";

/**
 * DELETE /api/admin/feeds/{feedId} - 피드 강제 삭제
 */
export async function deleteAdminFeed(feedId: number) {
  await api.delete(`/api/admin/feeds/${feedId}`);
}

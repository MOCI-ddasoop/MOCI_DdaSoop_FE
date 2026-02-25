import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/feeds/{feedId}/visibility/private - 피드 비공개 처리
 */
export async function putAdminFeedPrivate(feedId: number) {
  await api.put(`/api/admin/feeds/${feedId}/visibility/private`);
}

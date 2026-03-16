import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/feeds/{feedId}/visibility/private - 피드 비공개 처리
 * ※ 피드가 계속 노출되면: (1) BE에서 해당 호출 시 visibility=PRIVATE 반영 여부 (2) 피드 목록 API에서 PRIVATE 필터링 여부 확인 필요
 */
export async function putAdminFeedPrivate(feedId: number) {
  await api.put(`/api/admin/feeds/${feedId}/visibility/private`);
}

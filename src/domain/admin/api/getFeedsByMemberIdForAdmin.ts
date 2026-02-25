import { api } from "@/shared/config/api";

/** GET /api/feeds/members/{memberId}/scroll 응답 (관리자용) */
export interface FeedScrollItemForAdmin {
  id?: number;
  content?: string;
  authorName?: string;
  authorNickname?: string;
  visibility?: string;
  createdAt?: string;
  thumbnailUrl?: string;
}

export interface FeedScrollResponseForAdmin {
  content?: FeedScrollItemForAdmin[];
  nextCursor?: number;
  hasNext?: boolean;
  size?: number;
}

/**
 * 작성자 ID로 피드 목록 조회 (일반 API)
 */
export async function getFeedsByMemberIdForAdmin(
  memberId: number,
  params?: { lastFeedId?: number; size?: number }
) {
  const { data } = await api.get<FeedScrollResponseForAdmin>(
    `/api/feeds/members/${memberId}/scroll`,
    { params: { size: params?.size ?? 50, lastFeedId: params?.lastFeedId } }
  );
  return data;
}

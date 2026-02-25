import { api } from "@/shared/config/api";

/** 관리자 페이지에서 피드 정보 표시용 (일반 API GET /api/feeds/{feedId}) */
export interface FeedInfoForAdmin {
  id?: number;
  content?: string;
  authorName?: string;
  authorNickname?: string;
  visibility?: string;
  createdAt?: string;
  thumbnailUrl?: string;
}

export async function getFeedByIdForAdmin(feedId: number) {
  const { data } = await api.get<FeedInfoForAdmin>(`/api/feeds/${feedId}`);
  return data;
}

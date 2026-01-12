import type { components } from "@/types/api/v1";

// 피드
export type FeedUpdateRequest = components["schemas"]["FeedUpdateRequest"];
export type FeedCreateRequest = components["schemas"]["FeedCreateRequest"];
export type FeedResponse = components["schemas"]["FeedResponse"];

//무한스크롤 피드 리스트
export type FeedInfinite = Omit<
	FeedResponse,
	"visibility" | "isPinned" | "isReacted" | "isBookmarked" | "updatedAt"
> & {
	thumbnailUrl?: string;
	thumbnailWidth?: number;
	thumbnailHeight?: number;
};

import type { components } from "@/types/api/v1";

// 피드
export type FeedUpdateRequest = components["schemas"]["FeedUpdateRequest"];
export type FeedCreateRequest = components["schemas"]["FeedCreateRequest"];
export type FeedResponse = components["schemas"]["FeedResponse"];
export type FeedImageRequest = components["schemas"]["FeedImageRequest"];
export type FeedImageResponse = components["schemas"]["FeedImageResponse"];
export type InfiniteScrollResponse =
	components["schemas"]["InfiniteScrollResponse"];

//무한스크롤 피드 리스트
export type FeedInfinite = Omit<
	FeedResponse,
	"visibility" | "isBookmarked" | "updatedAt"
> & {
	thumbnailUrl?: string;
	thumbnailWidth?: number;
	thumbnailHeight?: number;
};

export type FeedInfiniteScroll = Omit<InfiniteScrollResponse, "content"> & {
	content: FeedResponse[];
};

export type ApiErrorResponse = {
	errorCode: string;
	message: string;
	status: number;
	timestamp: string;
};

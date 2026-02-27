import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";

export type InfiniteFeedParams =
	| { page?: undefined; query?: string; memberId?: number }
	| {
			page: "together";
			togetherId: number;
			notice?: boolean;
	  }
	| {
			page: "member";
			memberId: number;
			bookmark?: boolean;
	  };

export const useGetInfiniteFeedList = (
	infiniteParams: InfiniteFeedParams = {},
) => {
	return useInfiniteQuery({
		queryKey: (() => {
			if (infiniteParams.page === "together") {
				return infiniteParams.notice
					? queryKeys.feeds.togetherNotice(infiniteParams.togetherId)
					: queryKeys.feeds.infinite({
							page: "together",
							togetherId: infiniteParams.togetherId,
						});
			}
			if (infiniteParams.page === "member") {
				return infiniteParams.bookmark
					? queryKeys.feeds.bookmark()
					: queryKeys.feeds.infinite({
							page: "member",
							memberId: infiniteParams.memberId,
						});
			}
			if (
				infiniteParams.query &&
				// #만 입력한 경우 빼고
				!(
					infiniteParams.query.startsWith("#") &&
					infiniteParams.query.slice(1).trim() === ""
				)
			) {
				return queryKeys.feeds.search(infiniteParams.query.trim());
			}
			return queryKeys.feeds.infinite({ memberId: infiniteParams.memberId });
		})(),
		queryFn: async ({ pageParam }) => {
			let baseUrl;

			switch (infiniteParams.page) {
				case "together":
					baseUrl = infiniteParams.notice
						? `/api/feeds/together/${infiniteParams.togetherId}/notices`
						: `/api/feeds/together/${infiniteParams.togetherId}/scroll`;
					break;

				case "member":
					baseUrl = infiniteParams.bookmark
						? `/api/feeds/bookmarks/me`
						: `/api/feeds/members/${infiniteParams.memberId}/scroll`;
					break;

				default:
					if (infiniteParams.query) {
						if (infiniteParams.query.startsWith("#")) {
							// 태그검색
							baseUrl =
								infiniteParams.query.slice(1).trim() !== ""
									? "/api/feeds/search/tag"
									: "/api/feeds/scroll"; // 태그입력안했으면 전체무한스크롤
						} else baseUrl = "/api/feeds"; // 그냥검색
					} else {
						baseUrl = "/api/feeds/scroll"; // 검색아니면 전체무한스크롤
					}
			}
			const params: {
				size: number;
				tag?: string;
				keyword?: string;
				lastFeedId?: number;
				togetherId?: number;
				memberId?: number;
			} = { size: 20 };

			if (pageParam !== undefined && pageParam !== null) {
				params.lastFeedId = pageParam;
			}
			if (
				infiniteParams.page !== "together" &&
				infiniteParams.page !== "member"
			) {
				if (infiniteParams.query?.startsWith("#")) {
					params.tag = infiniteParams.query.slice(1).trim() || undefined;
				} else if (infiniteParams.query) {
					params.keyword = infiniteParams.query.trim();
				}
			}

			const res =
				infiniteParams.page === "together" && infiniteParams.notice
					? await api.get(baseUrl)
					: await api.get(baseUrl, { params });
			return res.data;
		},
		getNextPageParam: (lastPage) => {
			if (!lastPage.hasNext) return undefined;
			return lastPage.nextCursor;
		},
		initialPageParam: undefined,
	});
};

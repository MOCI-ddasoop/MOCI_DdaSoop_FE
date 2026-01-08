import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";

interface InfiniteFeedParams {
	page?: "together" | "member";
	togetherId?: number;
	memberId?: number;
}

export const useGetInfiniteFeedList = ({
	page,
	togetherId,
	memberId,
}: InfiniteFeedParams = {}) => {
	return useInfiniteQuery({
		queryKey: queryKeys.feeds.infinite({
			page,
			togetherId,
			memberId,
		}),
		queryFn: async ({ pageParam }) => {
			let baseUrl;

			switch (page) {
				case "together":
					baseUrl = `/api/feeds/together/${togetherId}/scroll`;
					break;

				case "member":
					baseUrl = `/api/feeds/members/${memberId}/scroll`;
					break;

				default:
					baseUrl = "/api/feeds/scroll";
			}
			const params: {
				size: number;
				lastFeedId?: number;
				togetherId?: number;
				memberId?: number;
			} = { size: 20, togetherId, memberId };

			if (pageParam !== undefined && pageParam !== null) {
				params.lastFeedId = pageParam;
			}

			const res = await api.get(baseUrl, { params });
			return res.data;
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: undefined,
	});
};

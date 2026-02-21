import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";

export type InfiniteFeedParams =
  | { page?: undefined; query?: string }
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
          infiniteParams.query.slice(1) === ""
        )
      ) {
        return queryKeys.feeds.search(infiniteParams.query);
      }
      return queryKeys.feeds.infinite();
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
          if (infiniteParams.query?.startsWith("#")) {
            baseUrl =
              infiniteParams.query.slice(1) !== ""
                ? "/api/feeds/search/tag"
                : "/api/feeds/scroll";
          } else {
            baseUrl = "/api/feeds/scroll";
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
          params.tag = infiniteParams.query.slice(1) || undefined;
        } else if (infiniteParams.query) {
          params.keyword = infiniteParams.query;
        }
      }

      const res =
        infiniteParams.page === "together" && infiniteParams.notice
          ? await api.get(baseUrl)
          : await api.get(baseUrl, { params });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
};

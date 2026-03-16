import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentPage } from "../types";

export const useCommentListByFeedId = (feedId: string | null) => {
	return useInfiniteQuery<CommentPage>({
		queryKey: queryKeys.comments.list(feedId || ""),
		queryFn: async ({ pageParam }) => {
			const { data } = await api.get(`api/comments/feeds/${feedId}`, {
				params: { page: pageParam, size: 20 },
			});
			return data;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (lastPage.last) return undefined;
			return (lastPage.number ?? 0) + 1;
		},
		staleTime: 0,
		enabled: !!feedId,
		gcTime: 1000,
	});
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentPage } from "../types";

// 마이페이지
export const useGetCommentListByUser = (userId: number | null | undefined) => {
	return useInfiniteQuery<CommentPage>({
		queryKey: queryKeys.comments.listByUser(userId ? String(userId) : ""),
		queryFn: async ({pageParam}) => {
			const {data} = await api.get(`api/comments/members/${userId}`, {
				params: {page: pageParam, size: 20}
			});
			return data;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (lastPage.last) return undefined;
			return (lastPage.number ?? 0) + 1;
		},
		staleTime: 0,
		gcTime: 5*60*1000, 
		enabled: !!userId,
	});
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { CommentPage } from "../types";

// 마이페이지
export const useGetCommentListByUser = (userId: string) => {
	return useQuery<CommentPage, Error>({
		queryKey: queryKeys.comments.listByUser(userId),
		queryFn: async () => {
			const res = await api.get(`/api/comments/members/${userId}`);
			return res.data;
		},
		refetchOnWindowFocus: false,
	});
};

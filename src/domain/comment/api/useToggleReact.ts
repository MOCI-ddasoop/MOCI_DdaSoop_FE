import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
	useQueryClient,
	useMutation,
	InfiniteData,
} from "@tanstack/react-query";
import { CommentPage } from "../types";
import { updateCommentTreeById } from "../utils/updateCommentTreeById";

type ToggleReactContext = {
	previousComments?: InfiniteData<CommentPage>;
	queryKey: ReturnType<typeof queryKeys.comments.list>;
};

export const useToggleReact = (feedId: number | undefined, userId?: number) => {
	const qc = useQueryClient();
	return useMutation<
		{ isReacted: boolean; reactionCount: number },
		Error,
		number,
		ToggleReactContext
	>({
		mutationKey: [queryKeys.comments.react(), feedId],
		mutationFn: async (id: number) => {
			const res = await api.post(`api/comments/${id}/reactions`);
			return res.data;
		},
		onMutate: async (commentId: number) => {
			const queryKey = queryKeys.comments.list(String(feedId));
			await qc.cancelQueries({ queryKey });
			const previousComments =
				qc.getQueryData<InfiniteData<CommentPage>>(queryKey);

			qc.setQueriesData<InfiniteData<CommentPage>>({ queryKey }, (old) => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						content: updateCommentTreeById(
							page.content,
							commentId,
							(comment) => {
								const nextReacted = !comment.isReacted;
								return {
									...comment,
									isReacted: nextReacted,
									reactionCount: nextReacted
										? (comment.reactionCount ?? 0) + 1
										: (comment.reactionCount ?? 0) - 1,
								};
							},
						),
					})),
				};
			});
			return { previousComments, queryKey };
		},
		onError: (err, commentId, context) => {
			if (context?.previousComments) {
				qc.setQueryData(context.queryKey, context.previousComments);
			}
		},
		onSuccess: (data, commentId, context) => {
			if (userId) {
				qc.invalidateQueries({
					queryKey: queryKeys.comments.listByUser(userId.toString()),
				});
			}
			qc.setQueryData<InfiniteData<CommentPage>>(context!.queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						content: updateCommentTreeById(
							page.content,
							commentId,
							(comment) => {
								if (comment.id !== commentId) return comment;
								return {
									...comment,
									isReacted: data.isReacted,
									reactionCount: data.reactionCount,
								};
							},
						),
					})),
				};
			});
		},
	});
};

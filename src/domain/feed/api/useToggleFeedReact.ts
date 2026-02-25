"use client";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
	InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll } from "../types";

export const useToggleFeedReact = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (feedId: string) => {
			const res = await api.post(`api/feeds/${feedId}/reactions`);
			console.log(res);
			return res;
		},
		onSuccess(res, id) {
			qc.invalidateQueries({ queryKey: queryKeys.feeds.id(id) });
			qc.invalidateQueries({ queryKey: queryKeys.feeds.reaction() });
			qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
				{ queryKey: ["feeds", "infinite"] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							content: page.content.map((feed) =>
								feed.id === Number(id)
									? {
											...feed,
											isReacted: res.data,
											reactionCount:
												(feed.reactionCount ?? 0) + (res.data ? 1 : -1),
										}
									: feed,
							),
						})),
					};
				},
			);
		},
	});
};

import { queryKeys } from "@/shared/config/queryKeys";
import {
	InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll, FeedUpdateRequest } from "../types";
import { api } from "@/shared/config/api";

export const useUpdateFeedById = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.feeds.udt(),
		mutationFn: async ({
			id,
			content,
		}: {
			id: number;
			content: FeedUpdateRequest;
		}) => {
			const res = await api.put(`api/feeds/${id}`, content);
			return res;
		},
		onSuccess: (res, { id }) => {
			const updatedFeed = res.data;
			qc.invalidateQueries({
				queryKey: queryKeys.feeds.id(id),
			});
			qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
				{ queryKey: ["feeds", "infinite"] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							content: page.content.map((feed) =>
								feed.id === id ? updatedFeed : feed,
							),
						})),
					};
				},
			);
		},
	});
};

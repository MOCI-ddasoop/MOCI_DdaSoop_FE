import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
	InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll } from "../types";

export const useDeleteFeedById = (
	options?: Parameters<typeof useMutation>[0],
) => {
	const qc = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.feeds.del(),
		mutationFn: ({ id }: { id?: number }) => {
			const res = api.delete(`api/feeds/${id}`);
			return res;
		},
		onSuccess: (data, variables, context, mutation) => {
			const { id } = variables;
			if (!id) return;
			qc.removeQueries({ queryKey: queryKeys.feeds.id(id) });
			qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
				{ queryKey: ["feeds", "infinite"] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							content: page.content.filter((feed) => feed.id !== id),
						})),
					};
				},
			);
			options?.onSuccess?.(data, variables, context, mutation);
		},
		...options,
	});
};

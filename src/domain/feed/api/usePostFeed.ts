import { api } from "@/shared/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedCreateRequest } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";
import { useAuthStore } from "@/store/authStore";

export const usePostFeed = (options?: Parameters<typeof useMutation>[0]) => {
	const qc = useQueryClient();
	const memberId = useAuthStore((s) => s.me?.memberId);

	return useMutation({
		...options,
		mutationFn: async (feedData: FeedCreateRequest) => {
			const { data } = await api.post("api/feeds", feedData);
			return data;
		},
		onSuccess: (data, variables, context, mutation) => {
			if (variables.feedType === "TOGETHER_NOTICE")
				qc.invalidateQueries({
					queryKey: queryKeys.feeds.togetherNotice(variables.togetherId!),
				});
			qc.invalidateQueries({
				predicate: (query) => {
					const key = query.queryKey as string[];
					return (
						key[0] === "feeds" &&
						key[1] === "infinite" &&
						typeof key[2] !== "number"
					);
				},
			});
			qc.invalidateQueries({
				queryKey: ["feeds", "infinite", memberId],
			});

			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

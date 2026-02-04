import { api } from "@/shared/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedCreateRequest } from "../types";

export const usePostFeed = (options?: Parameters<typeof useMutation>[0]) => {
	const qc = useQueryClient();

	return useMutation({
		...options,
		mutationFn: async (feedData: FeedCreateRequest) => {
			const { data } = await api.post("api/feeds", feedData);
			return data;
		},
		onSuccess: (data, variables, context, mutation) => {
			qc.invalidateQueries({
				queryKey: ["feeds", "infinite"],
			});

			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

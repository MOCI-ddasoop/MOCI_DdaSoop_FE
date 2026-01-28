"use client";

import { api } from "@/shared/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentCreateRequest } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export const useSetComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["setComment"],
		mutationFn: (commentItem: CommentCreateRequest) => {
			const res = api.post("api/comments", {
				...commentItem,
			});
			return res;
		},
		retry: 2,
		retryDelay: 1000,
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.comments.list(variables.targetId.toString()),
			});
		},
	});
};

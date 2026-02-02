"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDelCommentById = (feedId?: number) => {
	const qc = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.comments.del(),
		mutationFn: ({ id }: { id?: string | number }) => {
			const res = api.delete(`api/comments/${id}`);
			return res;
		},
		onSuccess: () => {
			if (feedId) {
				qc.invalidateQueries({
					queryKey: queryKeys.comments.list(
						typeof feedId === "string" ? feedId : String(feedId),
					),
				});
			}
		},
	});
};

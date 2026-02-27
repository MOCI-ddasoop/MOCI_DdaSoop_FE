import { api } from "@/shared/config/api";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";
import { ApiErrorResponse, FeedCreateRequest } from "../types";
import { AxiosError } from "axios";

export const usePostFeed = (
	options?: UseMutationOptions<
		unknown,
		AxiosError<ApiErrorResponse>,
		FeedCreateRequest
	>,
) => {
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

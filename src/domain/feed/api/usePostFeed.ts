import { api } from "@/shared/config/api";
import { useMutation } from "@tanstack/react-query";
import { FeedCreateRequest } from "../types";

export const usePostFeed = () => {
	return useMutation({
		mutationFn: async (feedData: FeedCreateRequest) => {
			const { data } = await api.post("api/feeds", feedData);
			return data;
		},
	});
};

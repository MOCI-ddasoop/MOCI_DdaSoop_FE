import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { FeedResponse } from "../types";

export const useGetFeedById = (
	id: string | number,
	enabled = true,
) => {
	return useQuery<FeedResponse>({
		queryKey: queryKeys.feeds.id(id),
		queryFn: async () => {
			const { data } = await api.get(`api/feeds/${id}`);
			return data;
		},
		enabled: !!id && enabled,
		staleTime: 0,
		gcTime: 0,
	});
};

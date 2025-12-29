import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { FeedDetail } from "../types";

export const useGetFeedById = (id: string) => {
  return useQuery<FeedDetail>({
    queryKey: queryKeys.feeds.id(id),
    queryFn: async () => {
      const { data } = await api.get(`api/feeds/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
};

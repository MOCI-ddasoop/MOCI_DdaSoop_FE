import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export type MyCountsResponse = {
  likedCount: number;
  commentedCount: number;
  feedCount: number;
}

export const useGetMyCounts = () => {
  return useQuery<MyCountsResponse>({
    queryKey: queryKeys.members.counts(),
    queryFn: async () => {
      const { data } = await api.get('/api/members/me/counts');
      return data;
    },
  staleTime: 0,
  gcTime: 0,
  });
};
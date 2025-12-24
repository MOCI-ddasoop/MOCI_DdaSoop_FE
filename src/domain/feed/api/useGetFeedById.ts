import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.feed.id(id),
    queryFn: async () => {
      const { data } = await api.get(`api/feed/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

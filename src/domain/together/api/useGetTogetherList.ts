import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetTogetherList = (id?: number) => {
  return useQuery({
    queryKey: queryKeys.together.list(id),
    queryFn: async () => {
      let baseUrl;
      if (id) baseUrl = `/api/v1/together/${id}`;
      else baseUrl = `api/v1/together/list`;
      const { data } = await api.get(baseUrl);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetTogetherById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.together.id(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/together/list/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

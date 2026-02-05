import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { MyTogetherResponse } from "../types";

export const useGetOwnTogetherList = (id: number) => {
  return useQuery<MyTogetherResponse>({
    queryKey: queryKeys.together.member(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/together/member/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetOwnDonationList = (id: number) => {
  return useQuery({
    // 타입설정하기
    queryKey: queryKeys.donate.member(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/member/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

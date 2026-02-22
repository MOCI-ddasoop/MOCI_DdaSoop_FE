import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { MyDonateResponse } from "../types";

export const useGetOwnDonationList = (id: number) => {
  return useQuery<MyDonateResponse>({
    // 타입설정하기
    queryKey: queryKeys.donate.member(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/member/${id}/create`);
      return data;
    },
    select: (data) => ({
      ...data,
      data: data.data.map((item) => {
        const current = item.currentAmount ?? 0;
        const goal = item.goalAmount ?? 0;
        return {
          ...item,
          progress: goal > 0 ? Math.round((current * 100) / goal) : 0,
        };
      }),
    }),
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

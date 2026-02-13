import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DetailResponse, DonateDetailInfo } from "../types";

export const useGetDonateById = (id: string) => {
  return useQuery<DetailResponse, Error, DonateDetailInfo>({
    queryKey: queryKeys.donate.id(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/list/${id}`);
      return data;
    },
    select: (data) => {
      const current = data.currentAmount ?? 0;
      const goal = data.goalAmount ?? 0;
      const progress =
        goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

      return {
        ...data,
        progress,
      };
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DonateDetailResponse, RawDonateDetailResponse } from "../types";

export const useGetDonateById = (
  id: string,
  options?: UseQueryOptions<
    RawDonateDetailResponse,
    Error,
    DonateDetailResponse
  >,
) => {
  return useQuery<RawDonateDetailResponse, Error, DonateDetailResponse>({
    queryKey: queryKeys.donate.id(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/list/${id}`);
      return data;
    },
    select: (data) => {
      const current = data.data.currentAmount ?? 0;
      const goal = data.data.goalAmount ?? 0;
      const progress =
        goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

      return {
        resultCode: data.resultCode,
        msg: data.msg,
        data: {
          ...data.data,
          progress,
        },
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 3,
    ...options,
  });
};

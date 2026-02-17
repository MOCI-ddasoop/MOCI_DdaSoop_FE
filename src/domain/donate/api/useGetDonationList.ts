import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DonateResponse, RawDonateResponse } from "../types";

export const useGetDonationList = (
  {
    category,
    status,
    sortType,
    page,
    size,
  }: {
    category?: string[];
    status?: string;
    sortType?: string;
    page?: number;
    size?: number;
    userId?: number;
  },
  options?: Omit<
    UseQueryOptions<RawDonateResponse, Error, DonateResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<RawDonateResponse, Error, DonateResponse>({
    queryKey: queryKeys.donate.list({ category, status, sortType, page, size }),
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.entries({ status, sortType, page, size })
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      );

      category?.forEach((c) => {
        params.append("categories", c);
      });

      // param 추가
      const { data } = await api.get(`api/v1/donation/list`, { params });
      return data;
    },
    select: (data) => {
      return {
        ...data,
        data: {
          ...data.data,
          content: data.data.content.map((item) => {
            const current = item.currentAmount ?? 0;
            const goal = item.goalAmount ?? 0;

            const progress =
              goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

            return {
              ...item,
              progress,
            };
          }),
        },
      };
    },
    staleTime: 500,
    gcTime: 1000,
    ...options,
  });
};

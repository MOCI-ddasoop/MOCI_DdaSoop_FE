import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DonateNewsResponse } from "../types";

export const useGetNews = (id: string) => {
  return useQuery<DonateNewsResponse>({
    queryKey: queryKeys.donate.news(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/notice/${id}`);
      return data;
    },
  });
};

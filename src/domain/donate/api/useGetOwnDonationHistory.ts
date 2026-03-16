import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DonateHistoryResponse } from "../types";

export const useGetOwnDonationHistory = (id: number) => {
  return useQuery<DonateHistoryResponse>({
    queryKey: queryKeys.donate.memberHistory(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/member/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

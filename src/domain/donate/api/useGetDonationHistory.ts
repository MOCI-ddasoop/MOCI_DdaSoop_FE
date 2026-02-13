import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DonorList } from "../types";

export const useGetDonationHistory = (id: string) => {
  return useQuery<DonorList>({
    queryKey: queryKeys.donate.history(id),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/donation/list/${id}/donorList`);
      return data;
    },
    enabled: !!id,
    staleTime: 500,
    gcTime: 1000,
  });
};

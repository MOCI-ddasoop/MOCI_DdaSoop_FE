import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DonateCreateRequest } from "../types";

export const useCreateDonate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.donate.new(),
    mutationFn: async (newDonateInfo: DonateCreateRequest) => {
      const res = await api.post(`api/v1/donation/create`, newDonateInfo);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donate", "list"] });
    },
  });
};

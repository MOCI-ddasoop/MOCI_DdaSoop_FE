import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useJoinTogether = (
  options?: UseMutationOptions<AxiosResponse, Error, number>,
) => {
  return useMutation({
    mutationKey: queryKeys.together.join(),
    mutationFn: (id: number | string) => {
      const res = api.post(`api/v1/together/${id}/participate`);
      return res;
    },
    ...options,
  });
};

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useLeaveTogether = (
  options?: UseMutationOptions<AxiosResponse, Error, number>,
) => {
  return useMutation({
    mutationKey: queryKeys.together.leave(),
    mutationFn: (id: number | string) => {
      const res = api.delete(`api/v1/together/${id}/leave`);
      return res;
    },
    ...options,
  });
};

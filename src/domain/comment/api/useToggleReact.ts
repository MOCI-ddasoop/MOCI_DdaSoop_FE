import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useToggleReact = (
  options?: UseMutationOptions<AxiosResponse, Error, number>
) => {
  return useMutation({
    mutationKey: queryKeys.comments.react(),
    mutationFn: async (id: number) => {
      const { data } = await api.post(`api/comments/${id}/reactions`);
      return data;
    },
    ...options,
  });
};

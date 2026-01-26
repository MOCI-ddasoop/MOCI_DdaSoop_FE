"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useDeleteNotification = (
  options?: UseMutationOptions<AxiosResponse, Error, number>
) => {
  return useMutation({
    mutationKey: queryKeys.notifications.delete(),
    mutationFn: (id: string | number) => {
      const res = api.delete(`api/notifications/${id}`);
      return res;
    },
    ...options,
  });
};

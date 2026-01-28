"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useDeleteReadNotification = (
  options?: UseMutationOptions<AxiosResponse, Error>,
) => {
  return useMutation({
    mutationKey: queryKeys.notifications.delete(),
    mutationFn: () => {
      const res = api.delete(`api/notifications/read`);
      return res;
    },
    ...options,
  });
};

"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useReadNotification = (
  options?: UseMutationOptions<AxiosResponse, Error, number>
) => {
  return useMutation({
    mutationKey: queryKeys.notifications.read(),
    mutationFn: (id: string | number) => {
      const res = api.put(`api/notifications/${id}/read`);
      return res;
    },
    ...options,
  });
};

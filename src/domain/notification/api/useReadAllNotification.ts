"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReadAllNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.notifications.read(),
    mutationFn: () => {
      const res = api.put(`api/notifications/read-all`);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });

      qc.invalidateQueries({
        queryKey: queryKeys.notifications.recent,
      });
    },
  });
};

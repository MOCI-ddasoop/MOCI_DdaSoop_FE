import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { NotificationSummaryResponse } from "../types";

export const useGetRecentNotification = (isLogin: boolean) => {
  return useQuery<NotificationSummaryResponse[]>({
    queryKey: queryKeys.notifications.recent,
    queryFn: async () => {
      const { data } = await api.get("api/notifications/recent", {
        params: { limit: 3 },
      });
      return data;
    },
    enabled: !!isLogin,
  });
};

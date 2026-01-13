import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { PageNotificationSummaryResponse } from "../types";

export const useGetNotification = (
  type: "all" | "likes" | "comments" | "together" | "system",
  pageNum: number | string,
  size?: number
) => {
  return useQuery<PageNotificationSummaryResponse>({
    queryKey: queryKeys.notifications.list(type),
    queryFn: async () => {
      let baseUrl;
      switch (type) {
        case "all":
          baseUrl = `/api/notifications`;
          break;

        default:
          baseUrl = `/api/notifications/type/FEED_REACTION`;
          break;
      }
      const params: {
        pageNum: number | string;
        size?: number;
      } = { pageNum, size };

      const { data } = await api.get(baseUrl, { params });
      return data;
    },
    enabled: !!type,
  });
};

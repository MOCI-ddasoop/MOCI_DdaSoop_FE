import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { PageNotificationSummaryResponse } from "../types";

export const useGetNotification = (
  type: "ALL" | "LIKES" | "COMMENTS" | "TOGETHER" | "SYSTEM",
  pageNum: number | string,
  size?: number,
) => {
  return useQuery<PageNotificationSummaryResponse>({
    queryKey: queryKeys.notifications.list(type),
    queryFn: async () => {
      let baseUrl;
      switch (type) {
        case "ALL":
          baseUrl = `/api/notifications`;
          break;

        default:
          baseUrl = `/api/notifications/category/${type}`;
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

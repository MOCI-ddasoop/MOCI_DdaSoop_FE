import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { PageNotificationSummaryResponse } from "../types";

export const useGetNotification = (
  type: "ALL" | "LIKES" | "COMMENTS" | "TOGETHER" | "DONATION" | "SYSTEM",
  pageNum: number | string,
  size?: number,
) => {
  return useQuery<PageNotificationSummaryResponse>({
    queryKey: queryKeys.notifications.page(type, Number(pageNum), size),
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
        page: number | string;
        size?: number;
      } = { page: Number(pageNum) - 1, size };

      const { data } = await api.get(baseUrl, { params });
      return data;
    },
    enabled: !!type,
  });
};

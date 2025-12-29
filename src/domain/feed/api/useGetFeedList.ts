import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedList = (pageNum: number | string) => {
  return useQuery({
    queryKey: queryKeys.feeds.list(pageNum),
    queryFn: () =>
      api.get("api/feeds", {
        params: {
          page: pageNum,
        },
      }),
  });
};

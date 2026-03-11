import { useQuery } from "@tanstack/react-query";
import { FeedInfinite } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";
import { api } from "@/shared/config/api";

export const useGetTogetherNotice = ({
  notice,
  queryParams,
}: {
  notice: boolean;
  queryParams?: string;
}) => {
  return useQuery<FeedInfinite[]>({
    queryKey: queryKeys.feeds.togetherNotice(Number(queryParams)),
    queryFn: async () => {
      const res = await api.get(`/api/feeds/together/${queryParams}/notices`);
      return res.data;
    },
    enabled: notice && !!queryParams,
  });
};

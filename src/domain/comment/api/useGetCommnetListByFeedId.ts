import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { CommentPage } from "../types";

export const useCommnetListByFeedId = (feedId: string | null) => {
  return useQuery<CommentPage>({
    queryKey: queryKeys.comments.list(feedId || ""),
    queryFn: async () => {
      const { data } = await api.get(
        `api/comments/feeds/${feedId}?page=0&size=20`
      );
      return data;
    },
    staleTime: 0,
    enabled: !!feedId,
    gcTime: 1000,
  });
};

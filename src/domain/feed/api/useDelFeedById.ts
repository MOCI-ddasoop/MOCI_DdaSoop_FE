import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll } from "../types";
import { CommentPage } from "@/domain/comment/types";
import { useAuthStore } from "@/store/authStore";

export const useDeleteFeedById = (
  { togetherId }: { togetherId?: number },
  options?: Parameters<typeof useMutation>[0],
) => {
  const qc = useQueryClient();
  const memberId = useAuthStore((s) => s.me?.memberId);

  return useMutation({
    mutationKey: queryKeys.feeds.del(),
    mutationFn: ({ id }: { id?: number }) => {
      const res = api.delete(`api/feeds/${id}`);
      return res;
    },
    onSuccess: (data, variables, context, mutation) => {
      const { id } = variables;
      const updateFn = (
        oldData: InfiniteData<FeedInfiniteScroll> | undefined,
      ) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.filter((feed) => feed.id !== id),
          })),
        };
      };
      if (!id) return;
      qc.removeQueries({ queryKey: queryKeys.feeds.id(id) });
      qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
        {
          predicate: (query) => {
            const key = query.queryKey as string[];
            return (
              key[0] === "feeds" &&
              key[1] === "infinite" &&
              typeof key[2] !== "number"
            );
          },
        },
        updateFn,
      );
      qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
        { queryKey: ["feeds", "infinite", memberId] },
        updateFn,
      );
      qc.setQueriesData<InfiniteData<CommentPage>>(
        { queryKey: queryKeys.comments.listByUser(String(memberId)) },
        updateFn,
      );
      if (togetherId) {
        qc.invalidateQueries({
          queryKey: queryKeys.feeds.togetherNotice(togetherId),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
};

import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfinite, FeedInfiniteScroll, FeedUpdateRequest } from "../types";
import { api } from "@/shared/config/api";
import { useAuthStore } from "@/store/authStore";
import { CommentPage } from "@/domain/comment/types";

export const useUpdateFeedById = ({ togetherId }: { togetherId?: number }) => {
  const qc = useQueryClient();
  const memberId = useAuthStore((s) => s.me?.memberId);

  return useMutation({
    mutationKey: queryKeys.feeds.udt(),
    mutationFn: async ({
      id,
      content,
    }: {
      id: number;
      content: FeedUpdateRequest;
    }) => {
      const res = await api.put(`api/feeds/${id}`, content);
      return res;
    },
    onSuccess: (res, { id }) => {
      const updatedFeed = res.data;
      const updateFn = (
        oldData: InfiniteData<FeedInfiniteScroll> | undefined,
      ) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((feed) =>
              feed.id === id ? updatedFeed : feed,
            ),
          })),
        };
      };
      if (!id) return;
      qc.refetchQueries({
        queryKey: queryKeys.feeds.id(id),
      });
      qc.setQueriesData<InfiniteData<CommentPage>>(
        { queryKey: queryKeys.comments.listByUser(String(memberId)) },
        updateFn,
      );
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
      if (togetherId) {
        qc.setQueryData<FeedInfinite[]>(
          queryKeys.feeds.togetherNotice(togetherId),
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((feed) => (feed.id === id ? updatedFeed : feed));
          },
        );
      }
    },
  });
};

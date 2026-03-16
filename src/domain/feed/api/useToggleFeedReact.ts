"use client";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfinite, FeedInfiniteScroll } from "../types";
import { useAuthStore } from "@/store/authStore";

export const useToggleFeedReact = ({
  togetherId,
}: {
  togetherId?: number;
  feedType?: "GENERAL" | "TOGETHER_VERIFICATION" | "TOGETHER_NOTICE";
}) => {
  const qc = useQueryClient();
  const memberId = useAuthStore((s) => s.me?.memberId);
  const updateFn =
    (id: number) => (oldData: InfiniteData<FeedInfiniteScroll> | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          content: page.content.map((feed) =>
            feed.id === id
              ? {
                  ...feed,
                  isReacted: !feed.isReacted,
                  reactionCount:
                    (feed.reactionCount ?? 0) + (feed.isReacted ? -1 : 1),
                }
              : feed,
          ),
        })),
      };
    };

  return useMutation({
    mutationFn: async (feedId: string) => {
      const res = await api.post(`api/feeds/${feedId}/reactions`);
      return res;
    },
    async onMutate(id) {
      await qc.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey as string[];
          return (
            key[0] === "feeds" &&
            key[1] === "infinite" &&
            typeof key[2] !== "number"
          );
        },
      });
      if (togetherId) {
        await qc.cancelQueries({
          queryKey: queryKeys.feeds.togetherNotice(togetherId),
        });
      }

      const previousData = qc.getQueriesData<InfiniteData<FeedInfiniteScroll>>({
        predicate: (query) => {
          const key = query.queryKey as string[];
          return (
            key[0] === "feeds" &&
            key[1] === "infinite" &&
            typeof key[2] !== "number"
          );
        },
      });
      const previousMemberData = qc.getQueryData<
        InfiniteData<FeedInfiniteScroll>
      >(["feeds", "infinite", memberId]);
      const previousNotice = togetherId
        ? qc.getQueryData<FeedInfinite[]>(
            queryKeys.feeds.togetherNotice(togetherId),
          )
        : undefined;
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
        updateFn(Number(id)),
      );

      qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
        { queryKey: ["feeds", "infinite", memberId] },
        updateFn(Number(id)),
      );
      if (togetherId) {
        qc.setQueriesData<FeedInfinite[]>(
          { queryKey: queryKeys.feeds.togetherNotice(togetherId) },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((feed) =>
              feed.id === Number(id)
                ? {
                    ...feed,
                    isReacted: !feed.isReacted,
                    reactionCount:
                      (feed.reactionCount ?? 0) + (feed.isReacted ? -1 : 1),
                  }
                : feed,
            );
          },
        );
      }
      return { previousData, previousNotice, previousMemberData };
    },
    onSuccess(_res, id) {
      qc.invalidateQueries({ queryKey: queryKeys.feeds.id(id) });
      qc.invalidateQueries({ queryKey: queryKeys.feeds.reaction() });
    },
    onError(_err, _id, context) {
      context?.previousData.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data);
      });
      if (context?.previousMemberData) {
        qc.setQueryData(
          ["feeds", "infinite", memberId],
          context.previousMemberData,
        );
      }
      if (togetherId && context?.previousNotice) {
        qc.setQueryData(
          queryKeys.feeds.togetherNotice(togetherId),
          context.previousNotice,
        );
      }
    },
  });
};

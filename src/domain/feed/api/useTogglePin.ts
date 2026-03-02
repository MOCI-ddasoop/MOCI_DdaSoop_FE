import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfinite, FeedInfiniteScroll } from "../types";
import { useAuthStore } from "@/store/authStore";
import { Alert } from "@/shared/utils/alert";

export const useTogglePin = ({
  currentPage,
  togetherId,
  feedId,
}: {
  currentPage: "" | "together" | "mypage";
  togetherId: number;
  feedId: number;
}) => {
  const qc = useQueryClient();
  const memberId = useAuthStore((s) => s.me?.memberId);

  return useMutation({
    mutationKey: queryKeys.feeds.togetherNoticePin(feedId),
    mutationFn: () => {
      const res = api.put(`api/feeds/${feedId}/pin`);
      return res;
    },
    onMutate: () => {
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
      const previousTogetherNoticeData = qc.getQueryData<FeedInfinite[]>(
        queryKeys.feeds.togetherNotice(togetherId),
      );

      const updateFn = (
        oldData: InfiniteData<FeedInfiniteScroll> | undefined,
      ) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((feed) =>
              feed.id === feedId ? { ...feed, isPinned: !feed.isPinned } : feed,
            ),
          })),
        };
      };

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
      qc.setQueriesData<FeedInfinite[]>(
        { queryKey: queryKeys.feeds.togetherNotice(togetherId) },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((feed) =>
            feed.id === feedId ? { ...feed, isPinned: !feed.isPinned } : feed,
          );
        },
      );
      return { previousData, previousMemberData, previousTogetherNoticeData };
    },
    onSuccess: () => {
      Alert({ text: "변경되었습니다", timer: 1500 });
    },
    onError: (_, __, context) => {
      Alert({ text: "핀 고정 토글에 실패했습니다", timer: 1500 });
      context?.previousData.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data);
      });
      if (context?.previousMemberData) {
        qc.setQueryData(
          ["feeds", "infinite", memberId],
          context.previousMemberData,
        );
      }
      if (togetherId && context?.previousTogetherNoticeData) {
        qc.setQueryData(
          queryKeys.feeds.togetherNotice(togetherId),
          context.previousTogetherNoticeData,
        );
      }
    },
  });
};

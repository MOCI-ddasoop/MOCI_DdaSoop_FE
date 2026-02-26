import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll } from "../types";
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
  const infiniteParams =
    currentPage === ""
      ? { page: undefined }
      : currentPage === "mypage"
        ? { page: "member" as const, memberId }
        : { page: "together" as const, togetherId };

  return useMutation({
    mutationKey: queryKeys.feeds.togetherNoticePin(feedId),
    mutationFn: () => {
      const res = api.put(`api/feeds/${feedId}/pin`);
      return res;
    },
    onMutate: () => {
      const previousData = qc.getQueriesData<InfiniteData<FeedInfiniteScroll>>({
        queryKey: queryKeys.feeds.infinite(infiniteParams),
      });

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
        { queryKey: queryKeys.feeds.infinite(infiniteParams) },
        updateFn,
      );
      return { previousData };
    },
    onSuccess: () => {
      Alert({ text: "변경되었습니다", timer: 1500 });
      qc.invalidateQueries({
        queryKey: queryKeys.feeds.togetherNotice(togetherId),
      });
      if (currentPage !== "") {
        qc.invalidateQueries({ queryKey: queryKeys.feeds.infinite() });
      }
      if (currentPage !== "mypage") {
        qc.invalidateQueries({
          queryKey: queryKeys.feeds.infinite({ page: "member", memberId }),
        });
      }
      if (currentPage !== "together") {
        qc.invalidateQueries({
          queryKey: queryKeys.feeds.infinite({ page: "together", togetherId }),
        });
      }
    },
    onError: (_, __, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data);
      });
      Alert({ text: "핀 고정 토글에 실패했습니다", timer: 1500 });
    },
  });
};

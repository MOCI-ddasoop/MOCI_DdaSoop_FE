import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FeedInfiniteScroll } from "../types";
import { useAuthStore } from "@/store/authStore";

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
      // qc.setQueriesData<InfiniteData<FeedInfiniteScroll>>(
      //   { queryKey: queryKeys.feeds.infinite(infiniteParams) },
      //   (oldData) => {
      //     if (!oldData) return oldData;
      //     return {
      //       ...oldData,
      //       pages: oldData.pages.map((page) => ({
      //         ...page,
      //         content: page.content.map((feed) =>
      //           feed.id === feedId
      //             ? { ...feed, isPinned: !feed.isPinned }
      //             : { ...feed },
      //         ),
      //       })),
      //     };
      //   },
      // );
      qc.invalidateQueries({
        queryKey: queryKeys.feeds.infinite({
          page: "together",
          togetherId,
          query: undefined,
          memberId: undefined,
        }),
      });
      qc.invalidateQueries({
        queryKey: queryKeys.feeds.infinite({
          page: "member",
          memberId,
          query: undefined,
          togetherId: undefined,
        }),
      });
      qc.refetchQueries({
        queryKey: queryKeys.feeds.togetherNotice(togetherId),
      });
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.feeds.togetherNotice(togetherId),
      }),
  });
};

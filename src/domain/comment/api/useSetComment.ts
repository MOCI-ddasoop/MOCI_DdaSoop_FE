"use client";

import { api } from "@/shared/config/api";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CommentCreateRequest } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";
import { Alert } from "@/shared/utils/alert";
import { FeedInfiniteScroll, FeedResponse } from "@/domain/feed/types";

export const useSetComment = (id: number, userId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["setComment"],
    mutationFn: async (commentItem: CommentCreateRequest) => {
      const res = await api.post("api/comments", {
        ...commentItem,
      });
      return res.data;
    },
    retry: 2,
    retryDelay: 1000,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.targetId.toString()),
      });
      queryClient.setQueriesData(
        { queryKey: queryKeys.feeds.id(variables.targetId.toString()) },
        (old: FeedResponse) => {
          if (!old) return old;
          return {
            ...old,
            commentCount: old.commentCount ?? 0 + 1,
          };
        },
      );
      queryClient.setQueriesData(
        {
          queryKey: queryKeys.feeds.infinite({
            page: "member",
            memberId: userId,
          }),
        },
        (old: InfiniteData<FeedInfiniteScroll>) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((feed) =>
                feed.id === id
                  ? {
                      ...feed,
                      commentCount: (feed.commentCount ?? 0) + 1,
                    }
                  : feed,
              ),
            })),
          };
        },
      );
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.listByUser(userId.toString()),
        });
      }
    },
    onError: () => {
      Alert({
        title: "업로드 실패",
        timer: 1500,
      });
    },
  });
};

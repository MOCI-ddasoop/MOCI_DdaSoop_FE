"use client";

import { groupById } from "@/shared/utils/groupById";
import CommentItem from "./CommentItem";
import { useMemo } from "react";
import FeedSummary from "@/domain/feed/components/FeedSummary";
import { useGetCommentListByUser } from "../api/useGetCommentListByUser";
import { useAuthStore } from "@/store/authStore";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

//마이페이지에 들어갈 내 댓글보기
function FeedGroupCommentContainer() {
  const userId = useAuthStore((state) => state.me?.memberId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
  } = useGetCommentListByUser(userId);

  const triggerRef = useIntersection({
    onIntersect: () => {
      fetchNextPage();
    },
    hasNextPage,
    rootMargin: "40px",
    isFetching,
  });

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  const sortedGroupedComments = useMemo(() => {
    if (comments.length === 0) return [];

    const grouped = groupById(comments, "targetId");

    return Object.entries(grouped)
      .map(([feedId, groupComments]) => {
        const latestCommentTime = Math.max(
          ...groupComments.map((c) => new Date(c.createdAt || 0).getTime())
        );

        return {
          feedId: Number(feedId),
          comments: groupComments,
          latestCommentTime,
        };
      })
      .sort((a, b) => b.latestCommentTime - a.latestCommentTime);
  }, [comments]);

  const openFeedModal = (feedId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("feedId", String(feedId));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isPending) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="sm-gray-spinner" />
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 w-full">
      {sortedGroupedComments.map(({ feedId, comments: groupComments }) => {
        
        const isDeleted = groupComments[0]?.feedInfo?.deleted;

        return (
          <div
            className="flex gap-4 w-full border-b border-gray-100 flex-1"
            key={feedId}
          >
            <FeedSummary
              id={feedId}
              isDeleted={isDeleted}
              className={`w-1/2 h-fit ${!isDeleted ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => {
                if (!isDeleted) openFeedModal(feedId); 
              }}
            />

            <ul className="flex flex-col gap-2 w-fit flex-1">
              {groupComments.map((comment) => (
                <div
                  key={comment.id}
                  className={comment.feedInfo?.deleted ? "cursor-default" : "cursor-pointer"}
                  onClick={() => {
                    if (!comment.feedInfo?.deleted) openFeedModal(feedId);
                  }}
                >
                  <CommentItem item={comment} className="w-full" />
                </div>
              ))}
            </ul>
          </div>
        );
      })}

      <div ref={triggerRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <div className="sm-gray-spinner"></div>}

        {!isFetchingNextPage && comments.length === 0 && !isFetching && (
          <p className="text-sm text-gray-400">작성한 댓글이 없습니다</p>
        )}

        {!isFetchingNextPage && comments.length > 0 && !hasNextPage && (
          <p className="text-sm text-gray-400">마지막 댓글입니다</p>
        )}
      </div>
    </ul>
  );
}

export default FeedGroupCommentContainer;
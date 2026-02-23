"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FeedDetailCard from "./FeedDetailCard";
import CommentContainer from "@/domain/comment/components/CommentContainer";
import CommentInput from "@/domain/comment/components/CommentInput";
import { useGetFeedById } from "../api/useGetFeedById";
import ImageSwiper from "@/shared/components/ImageSwiper";
import { scrollToNewComment } from "@/domain/comment/utils/scrollToNewComment";

function FeedModal({ feedId }: { feedId: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [targetNickname, setTargetNickname] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const { data: feedDetailData } = useGetFeedById(feedId);

  useEffect(() => {
    const el = contentRef.current;
    return () => {
      setTargetNickname(null);
      el?.scrollTo({ top: 0 });
    };
  }, []);

  // 대댓글 클릭했을때 @작성자
  const handleCommentTargetClick = (
    nickname: string | null,
    id: number | null,
  ) => {
    setTargetNickname(nickname ?? null);
    setTargetId(id ?? null);
  };

  const handleScrollToComment = useCallback((target?: HTMLElement) => {
    const container = contentRef.current;
    if (!container) return;
    if (target) {
      scrollToNewComment(container, target);
    } else {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className="flex w-full h-[90vh] max-w-4xl bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {/* image 영역 */}
      <div className="relative h-full w-3/5">
        <ImageSwiper
          mode="feed"
          slideList={
            feedDetailData?.images?.map((img) => ({
              imageUrl: img.imageUrl ?? "/defaultFeedImage.png",
            })) || []
          }
        />
      </div>

      {/* content 영역 */}
      <div className="flex flex-col w-2/5 h-full bg-white">
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <FeedDetailCard item={feedDetailData ?? {}} />

          {/* comment 영역 */}
          <CommentContainer
            onCommentTargetClick={handleCommentTargetClick}
            onScrollToComment={handleScrollToComment}
          />
        </div>

        <div className="px-2 py-1 border-t border-gray-200 bg-white">
          <CommentInput
            targetNickname={targetNickname}
            targetId={targetId}
            onCommentTargetClick={handleCommentTargetClick}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedModal;

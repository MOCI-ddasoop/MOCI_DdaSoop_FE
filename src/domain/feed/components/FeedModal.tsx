"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import FeedDetailCard from "./FeedDetailCard";
import CommentContainer from "@/domain/comment/components/CommentContainer";
import CommentInput from "@/domain/comment/components/CommentInput";
import { useGetFeedById } from "../api/useGetFeedById";

const FEED_DATA = Array.from({ length: 20 }).map((_, index) => ({
  id: 1,
  title: "Feed 1",
  author: "author 1",
  content: "Feed 1 content",
  category: "category 1",
  date: "2025년 1월 1일",
  likeCount: 10,
  commentCount: 10,
  tags: ["tag1", "tag2", "tag3"],
  likedByMe: false,
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
}));

function FeedModal({
  feedId,
  onClose,
  isOpen,
}: {
  feedId: string;
  onClose: () => void;
  isOpen: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [targetNickname, setTargetNickname] = useState<string | null>(null);
  const { data } = useGetFeedById(feedId);
  console.log(data);

  const handleClose = () => {
    onClose();
    setTargetNickname(null);
    contentRef.current?.scrollTo({ top: 0 });
  };

  const handleCommentTargetClick = (nickname: string | null) => {
    setTargetNickname(nickname ?? null);
  };

  // TODO: query를 여기서 조회하고 모달에 출력

  useEffect(() => {
    if (!isOpen) return;

    // ESC 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  return createPortal(
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          className="flex w-full h-[90vh] max-w-4xl max-h-4xl bg-white rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* image 영역 */}
          <div className="relative h-full w-3/5">
            <Image
              src={FEED_DATA[Number(feedId)].image}
              alt={FEED_DATA[Number(feedId)].title}
              fill
              className="object-cover"
            />
          </div>

          {/* content 영역 */}
          <div
            ref={contentRef}
            className="relative w-2/5 h-full overflow-y-auto overflow-x-hidden"
          >
            <FeedDetailCard
              id={FEED_DATA[Number(feedId)].id}
              title={FEED_DATA[Number(feedId)].title}
              author={FEED_DATA[Number(feedId)].author}
              content={FEED_DATA[Number(feedId)].content}
              category={FEED_DATA[Number(feedId)].category}
              date={FEED_DATA[Number(feedId)].date}
              likeCount={FEED_DATA[Number(feedId)].likeCount}
              commentCount={FEED_DATA[Number(feedId)].commentCount}
              image={FEED_DATA[Number(feedId)].image}
              likedByMe={FEED_DATA[Number(feedId)].likedByMe}
              tags={FEED_DATA[Number(feedId)].tags}
            />

            {/* comment 영역 */}
            <CommentContainer onCommentTargetClick={handleCommentTargetClick} />

            <div className="p-2 border-t border-gray-200 sticky bottom-0 left-0 w-full bg-white">
              <CommentInput
                targetNickname={targetNickname}
                onCommentTargetClick={handleCommentTargetClick}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
}

export default FeedModal;

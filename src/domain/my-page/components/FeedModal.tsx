"use client";
import { Activity, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import FeedDetailCard from "./FeedDetailCard";
import CommentContainer from "./CommentContainer";

const FEED_DATA = [
  {
    id: 1,
    title: "Feed 1",
    author: "author 1",
    content: "Feed 1 content",
    category: "category 1",
    date: "2025-01-01",
    likeCount: 10,
    commentCount: 10,
    tags: ["tag1", "tag2", "tag3"],
    likedByMe: false,
    image:
      "https://i.namu.wiki/i/bjhl-c4YuugxXFaZaFRbPvU0IGuNuSPvqVoujzeccTdP39XErpUKxRO6HWPeNj9CWIMe_mEnEj5xfuZgB8BrNawRlD1X9gSxsHJsBSVf82G71Mdw4OROpopv0sa4SwRyDINrp08r3mD9WPCv1Xpsow.webp",
  },
];

const COMMENT_LIST = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  profileImage:"https://i.namu.wiki/i/bjhl-c4YuugxXFaZaFRbPvU0IGuNuSPvqVoujzeccTdP39XErpUKxRO6HWPeNj9CWIMe_mEnEj5xfuZgB8BrNawRlD1X9gSxsHJsBSVf82G71Mdw4OROpopv0sa4SwRyDINrp08r3mD9WPCv1Xpsow.webp",
  author: "John Doe",
  date: "2025-01-01",
  content: "Hello, world!",
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
  console.log(feedId);
  // query를 여기서 조회하고 모달에 출력

  useEffect(() => {
    // ESC 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    // body 스크롤 막기
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={onClose}
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
          <div className="w-2/5 h-full overflow-y-auto">
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
            <CommentContainer commentList={COMMENT_LIST} />
          </div>

          
        </div>
      </div>
    </Activity>,
    document.body
  );
}

export default FeedModal;

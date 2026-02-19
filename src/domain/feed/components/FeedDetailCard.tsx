"use client";
import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BsChatRight } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { MdIosShare } from "react-icons/md";
import { useToggleFeedBookmark } from "../api/useToggleFeedBookmark";
import { FeedResponse } from "../types";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { formatRelativeDate } from "@/shared/utils/timeFormatRelativeDate";
import { useRouter } from "next/navigation";

type FeedDetailCardProps = {
  item: FeedResponse;
  className?: string;
};

function FeedDetailCard({ item, className }: FeedDetailCardProps) {
  const {
    id,
    authorName: author,
    authorProfileImage = "/defaultFeedImage.png",
    content,
    createdAt,
    bookmarkCount = 0,
    commentCount = 0,
    isBookmarked: bookMarkedByMe = false,
    togetherTitle,
    togetherId,
    tags,
  } = item;
  const [bookmarkInfo, setBookmarkInfo] = useState<{
    bookmarkCount: number;
    bookMarkedByMe: boolean;
  }>({
    bookmarkCount: bookmarkCount,
    bookMarkedByMe: bookMarkedByMe,
  });
  const router = useRouter();

  useEffect(() => {
    setBookmarkInfo({
      bookmarkCount,
      bookMarkedByMe,
    });
  }, [bookmarkCount, bookMarkedByMe]);

  const [selectedOwnerOption, setSelectedOwnerOption] = useState<string | null>(
    null,
  );
  const { mutate: toggleBookmarkMutate } = useToggleFeedBookmark();

  const handleLike = () => {
    if (!id) return;
    setBookmarkInfo((prev) => ({
      bookmarkCount: prev.bookMarkedByMe
        ? prev.bookmarkCount - 1
        : prev.bookmarkCount + 1,
      bookMarkedByMe: !prev.bookMarkedByMe,
    }));

    toggleBookmarkMutate(id.toString());
  };

  // 옵션은 switch문으로 처리
  const handleOwnerOptionClick = (option: string) => {
    setSelectedOwnerOption(option);
    switch (option) {
      case "수정":
        console.log("수정");
        break;
      case "삭제":
        console.log("삭제");
        break;
      case "신고":
        console.log("신고");
        break;
    }
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    params.set("query", `#${tag}`);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={tw("bg-white h-fit", className)}>
      {/* 작성자 정보 영역 */}
      <div className="flex items-center gap-2 border-b border-gray-200 p-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image src={authorProfileImage} alt={author ?? "기본이미지"} fill />
          </div>
          <div className="text-sm text-nowrap">{author}</div>
        </div>
        <DropdownButton
          options={["수정", "삭제", "신고"]}
          selected={selectedOwnerOption ?? ""}
          setSelected={handleOwnerOptionClick}
          size="md"
          menuSize="md"
          placement="bottom-end"
          highlightingLastOption={true}
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="border-b border-gray-200 p-2">
        {/* 내용 영역 */}
        <div className="p-2 min-h-[100px]">
          {/* todo: InnerHtml넣기전에 안전한 html인지 검사하기 */}
          <p
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content ?? "") }}
          />
        </div>

        {/* 모임 정보 영역 */}
        {togetherId && togetherTitle && (
          <TogetherListItem
            id={togetherId}
            image={""}
            name={togetherTitle}
            category={""}
            isOnline={""}
            href={"/together"}
          />
        )}

        {/* 태그 영역 */}
        <div className="flex items-center gap-2 flex-wrap p-1">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="text-mainblue cursor-pointer hover:underline"
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 날짜 영역 */}
        <div className="text-sm text-gray-500 p-1">
          {formatRelativeDate(createdAt ?? "")}
        </div>
      </div>

      <div className="flex items-center gap-2 py-1 px-2 border-b border-gray-200 justify-between">
        <div className="flex items-center gap-2">
          {/* 댓글 영역 */}
          <button
            type="button"
            className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
          >
            <BsChatRight size={24} className="group-hover:text-amber-700" />
            <p className="group-hover:text-amber-700">{commentCount}</p>
          </button>

          {/* 좋아요 영역 */}
          <button
            type="button"
            className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
            onClick={handleLike}
          >
            <div className="relative w-6 h-6">
              <FaBookmark
                size={24}
                className={tw(
                  "group-hover:text-amber-700 transition absolute",
                  bookmarkInfo.bookMarkedByMe ? "opacity-100" : "opacity-0",
                )}
              />
              <FaRegBookmark
                size={24}
                className={tw(
                  "group-hover:text-amber-700 transition absolute",
                  bookmarkInfo.bookMarkedByMe ? "opacity-0" : "opacity-100",
                )}
              />
            </div>
            <p className="group-hover:text-amber-700">
              {bookmarkInfo.bookmarkCount}
            </p>
          </button>
        </div>

        <button type="button" className="cursor-pointer duration-100 group">
          <MdIosShare
            size={24}
            className="text-gray-500 group-hover:text-amber-700"
          />
        </button>
      </div>
    </div>
  );
}

export default FeedDetailCard;

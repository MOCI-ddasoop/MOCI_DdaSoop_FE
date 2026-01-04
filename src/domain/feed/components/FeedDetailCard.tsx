import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BsChatRight } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { MdIosShare } from "react-icons/md";
import { useToggleFeedBookmark } from "../api/useToggleFeedBookmark";

interface FeedDetailCardProps {
  id: number;
  title?: string;
  author: string;
  content: string;
  category: string;
  date: string;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  images: string[];
  bookMarkedByMe: boolean;
  tags: string[];
  visiblity: string;
  className?: string;
}

function FeedDetailCard({
  id,
  title,
  author,
  content,
  date,
  bookmarkCount,
  commentCount,
  images,
  bookMarkedByMe,
  tags,
  className,
}: FeedDetailCardProps) {
  const [bookmarkInfo, setBookmarkInfo] = useState<{
    bookmarkCount: number;
    bookMarkedByMe: boolean;
  }>({
    bookmarkCount: bookmarkCount,
    bookMarkedByMe: bookMarkedByMe,
  });

  useEffect(() => {
    setBookmarkInfo({
      bookmarkCount,
      bookMarkedByMe,
    });
  }, [bookmarkCount, bookMarkedByMe]);

  const [selectedOwnerOption, setSelectedOwnerOption] = useState<string | null>(
    null
  );
  const { mutate: toggleBookmarkMutate } = useToggleFeedBookmark();

  const handleLike = () => {
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

  return (
    <div className={tw("bg-white h-fit", className)}>
      {/* 작성자 정보 영역 */}
      <div className="flex items-center gap-2 border-b border-gray-200 p-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image src={images[0]} alt={author} fill />
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
          hilightingLastOption={true}
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="border-b border-gray-200 p-2">
        {/* 내용 영역 */}
        <div className="p-2 min-h-[100px]">
          {title && <h1 className="text-lg font-bold">{title}</h1>}
          <p className="text-sm text-gray-500">{content}</p>
        </div>

        {/* 모임 정보 영역 */}
        <div className="flex items-center gap-2 p-4 border border-gray-300 rounded-md">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image src={images[0]} alt={author} fill />
          </div>
          <div className="flex flex-col">
            <div className="font-bold">모임이름을입력하세요</div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded-md w-fit">
                text
              </div>
              <div className="text-sm text-gray-500 p-2 bg-red-200 rounded-md w-fit">
                text
              </div>
            </div>
          </div>
        </div>

        {/* 태그 영역 */}
        <div className="flex items-center gap-2 flex-wrap p-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-mainblue cursor-pointer hover:underline"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 날짜 영역 */}
        <div className="text-sm text-gray-500 p-1">{date}</div>
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
                  bookmarkInfo.bookMarkedByMe ? "opacity-100" : "opacity-0"
                )}
              />
              <FaRegBookmark
                size={24}
                className={tw(
                  "group-hover:text-amber-700 transition absolute",
                  bookmarkInfo.bookMarkedByMe ? "opacity-0" : "opacity-100"
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

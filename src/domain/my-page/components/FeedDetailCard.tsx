import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

interface FeedDetailCardProps {
  id: number;
  title: string;
  author: string;
  content: string;
  category: string;
  date: string;
  likeCount: number;
  commentCount: number;
  image: string;
  likedByMe: boolean;
  tags: string[];
  className?: string;
}

function FeedDetailCard({
  id,
  title,
  author,
  content,
  category,
  date,
  likeCount,
  commentCount,
  image,
  likedByMe,
  tags,
  className,
}: FeedDetailCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(likedByMe || false);

  const handleLike = () => {
    setIsLiked(!isLiked);

    // 서버 통신 추가 로직 작성
    if (isLiked) {
      // 좋아요 취소 로직
    } else {
      // 좋아요 추가 로직
    }
  };

  return (
    <div className={tw("bg-white p-4 h-fit", className)}>
      {/* 작성자 정보 영역 */}
      <div className="flex items-center gap-2 border-b border-gray-200 p-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image
              src={image}
              alt={author}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="text-sm text-nowrap">{author}</div>
        </div>
        <button type="button" className="cursor-pointer">
          <BsThreeDots size={24} className="text-gray-500" />
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4 min-h-[200px]">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{content}</p>
      </div>

      {/* 모임이름정보는 컴포넌트 재사용 가능성이 있어서 따로 구현 */}
      <div className="flex items-center gap-2 p-4 border border-gray-300 rounded-md">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={image}
            alt={author}
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold">
            모임이름을입력하세요
          </div>
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

      <div className="flex items-center gap-2 p-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[#237DB1] cursor-pointer hover:underline"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500 p-2">{date}</div>
    </div>
  );
}

export default FeedDetailCard;

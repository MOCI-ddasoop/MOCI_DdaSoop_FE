import Image from "next/image";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface CommentItemProps {
  profileImage: string;
  author: string;
  date: string;
  content: string;
}

function CommentItem({
  profileImage,
  author,
  date,
  content,
}: CommentItemProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <li
      className="flex flex-col items-start p-2 w-full border-b border-gray-100 gap-1 hover:bg-gray-100"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={profileImage}
            alt={author}
            width={44}
            height={44}
            className="object-cover"
          />
        </div>

        {/* 유저이름, 컨텐츠 */}
        <div>
          <span className="inline font-semibold text-gray-900">{author} </span>
          <span className="inline">{content}</span>
        </div>
      </div>

      <div className="w-full flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{date}</div>
          <button
            type="button"
            className="cursor-pointer text-sm text-gray-500"
          >
            답글 달기
          </button>
        </div>
        {isHover && (
          <button
            type="button"
            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
          >
            <BsThreeDotsVertical size={16} />
          </button>
        )}

      </div>
    </li>
  );
}
export default CommentItem;

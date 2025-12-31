"use client";
import TextBox from "@/shared/components/TextBox";
import tw from "@/shared/utils/tw";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSetComment } from "../api/useSetComment";

interface CommentInputProps {
  onSubmit?: (comment: string) => void;
  onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
  targetNickname?: string | null;
}

function CommentInput({
  targetNickname,
  onSubmit,
  onCommentTargetClick,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const { mutate } = useSetComment();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(comment);
    setComment("");
    onCommentTargetClick?.(null, null);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      {targetNickname && (
        <div
          className={tw(
            "flex items-center gap-2 justify-between duration-300 translate-y-full opacity-0",
            targetNickname ? "translate-y-0 opacity-100" : ""
          )}
        >
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-mainblue ">
              @{targetNickname}
            </span>{" "}
            님에게 보내는 댓글
          </div>
          <button
            type="button"
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => onCommentTargetClick?.(null, null)}
          >
            <IoClose size={16} />
          </button>
        </div>
      )}
      <div className="flex justify-center items-stretch gap-2 w-full h-full">
        <div className="flex-1 flex items-center border-gray-300">
          <input
            type="text"
            placeholder="댓글을 입력해주세요."
            className="focus:outline-0"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="self-stretch py-2">
          <button
            type="submit"
            className={tw(
              "h-full bg-gray-300 text-white p-2 rounded-md text-nowrap text-sm duration-150",
              comment.length > 0 ? "bg-mainblue cursor-pointer" : "bg-gray-300"
            )}
          >
            게시
          </button>
        </div>
      </div>
    </form>
  );
}
export default CommentInput;

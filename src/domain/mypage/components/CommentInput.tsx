"use client";
import tw from "@/shared/utils/tw";
import { Activity, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

interface CommentInputProps {
  onSubmit?: (comment: string) => void;
  onCommentTargetClick?: (nickname: string | null) => void;
  targetNickname?: string | null;
}

function CommentInput({
  targetNickname,
  onSubmit,
  onCommentTargetClick,
}: CommentInputProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(comment);
    onCommentTargetClick?.(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Activity mode={targetNickname ? "visible" : "hidden"}>
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
            onClick={() => onCommentTargetClick?.(null)}
          >
            <IoClose size={16} />
          </button>
        </div>
      </Activity>

      <div className="flex justify-center items-stretch gap-2 w-full h-full">
        <div className="flex-1 flex items-center border-gray-300">
          <textarea
            ref={textAreaRef}
            value={comment}
            onChange={onChange}
            placeholder="댓글을 입력해주세요."
            rows={1}
            className="w-full p-2 resize-none overflow-hidden focus:outline-none border-none"
            style={{ lineHeight: "1.2" }}
          />
        </div>

        <div className="self-stretch py-2">
          <button
            type="submit"
            className={tw(
              "h-full bg-gray-300 text-white p-2 rounded-md text-nowrap text-sm duration-150",
              comment.length > 0 ? "bg-mainblue" : "bg-gray-300"
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

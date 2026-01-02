"use client";

import reportModalStore from "@/domain/report/stores/reportModalStore";
import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState } from "react";
import { useToggleReact } from "../api/useToggleReact";
import { CommentType } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

interface CommentItemProps {
  item: CommentType;
  onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
  feedId?: string | null;
  className?: string;
  isRelies?: boolean;
}

function CommentItem({
  item,
  onCommentTargetClick,
  feedId,
  className,
  isRelies,
}: CommentItemProps) {
  const {
    id,
    authorName,
    authorNickname,
    authorProfileImage,
    content,
    createdAt,
    replies,
    replyCount,
  } = item;

  const qc = useQueryClient();

  const [reactionCount, setReactionCount] = useState<number>(
    () => item.reactionCount
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const setReportModalOpen = reportModalStore((state) => state.setIsOpen);
  const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);

  const { mutate: toggleReactMutation, isPending } = useToggleReact({
    onSuccess: () => {
      if (!feedId) return;

      qc.invalidateQueries({
        queryKey: queryKeys.comments.list(feedId),
      });
    },
    onMutate: () => {
      setReactionCount((prev) => prev + 1);
    },
    onError: () => {
      setReactionCount((prev) => prev - 1);
    },
  });

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    switch (option) {
      case "수정":
        console.log("수정");
        break;
      case "삭제":
        console.log("삭제");
        break;
      case "신고":
        setReportModalOpen(true);
        break;
    }
  };

  return (
    <li className="flex gap-1">
      {isRelies && <div className="w-1 h-full bg-gray-300"></div>}
      <div
        className={tw(
          "relative flex flex-col items-start p-2 w-full border-b border-gray-100 gap-1 hover:bg-gray-100 group",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image
              src={authorProfileImage}
              alt={authorName}
              fill
              className="object-cover"
            />
          </div>

          {/* 유저이름, 컨텐츠 */}
          <div>
            <span className="inline font-semibold text-gray-900">
              {authorName}{" "}
            </span>
            <span className="inline">{content}</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="text-sm text-gray-500">{createdAt}</div> */}
            <button
              type="button"
              className="cursor-pointer text-sm text-gray-500"
              onClick={() => {
                console.log("author", authorNickname);
                onCommentTargetClick?.(authorNickname ?? null, id ?? null);
                setIsRepliesOpen((prev) => !prev);
              }}
            >
              답글 {replyCount}
            </button>
            <button
              type="button"
              className="cursor-pointer text-sm text-gray-500 active:scale-95 trasnsisiton-transform"
              onClick={() => {
                toggleReactMutation(id ?? 0);
              }}
              disabled={isPending}
            >
              좋아요 {reactionCount}
            </button>
          </div>
          {/* TODO: 수정, 삭제 기능은 로그인이 연결되었을 때, ME로 작성자 ID와 내 아이디 비교하여 렌더링 */}
          <DropdownButton
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            options={["수정", "삭제", "신고"]}
            selected={selectedOption ?? ""}
            setSelected={handleOptionClick}
            buttonStyle="horizontal"
            size="sm"
            menuSize="sm"
            placement="bottom-end"
            hilightingLastOption={true}
          />
        </div>

        {/* 대댓글이 있다면 재귀적으로 호출 
          TODO: 답글에 답글까지는 불러오지 못 하는 것으로 보임. 개선 필요
        */}
        {replies && replies.length > 0 && isRepliesOpen && (
          <ul className="pl-2 mt-2 flex flex-col gap-2 border-l-2 border-slate-500">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                item={reply}
                feedId={feedId}
                onCommentTargetClick={onCommentTargetClick}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
export default CommentItem;

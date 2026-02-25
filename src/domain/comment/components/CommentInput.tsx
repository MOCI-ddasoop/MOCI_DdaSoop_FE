"use client";
import tw from "@/shared/utils/tw";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useSetComment } from "../api/useSetComment";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import { useCommentScrollStore } from "../provider/CommentScrollProvider";
import { useSubmitRegistry } from "@/domain/feed/provider/SubmitRegistryProvider";
import { useModalStore } from "@/domain/modal/store/useModalStore";
import { ConfirmAlert } from "@/shared/utils/alert";

interface CommentInputProps {
  onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
  targetNickname?: string | null;
  targetId?: number | null;
  shouldCommentFocus: number;
  userId?: number;
}

function CommentInput({
  targetNickname,
  targetId,
  onCommentTargetClick,
  shouldCommentFocus,
  userId,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const feedId = useSearchParams().get("feedId");
  const { mutate: setCommentMutation, isPending } = useSetComment();
  const textBoxRef = useRef<TextBoxHandle>(null);
  const scrollActions = useCommentScrollStore((s) => s.actions);
  const setCanClose = useModalStore((s) => s.setCanClose);
  const resetCanClose = useModalStore((s) => s.resetCanClose);

  const submitComment = useCallback(() => {
    if (!textBoxRef.current) return;
    if (!comment) return;
    if (!comment.trim()) return;

    setCommentMutation(
      {
        commentType: "FEED",
        content: textBoxRef.current.getHTML(),
        targetId: Number(feedId),
        parentId: targetId ?? undefined,
      },
      {
        onSuccess: (data) => {
          scrollActions.setLastComment(data);
          scrollActions.setLastReplyParent(targetId ?? null);
          onCommentTargetClick?.(null, null);
          textBoxRef.current?.clear();
        },
      },
    );
  }, [
    comment,
    feedId,
    onCommentTargetClick,
    scrollActions,
    setCommentMutation,
    targetId,
  ]);

  useEffect(() => {
    if (targetId) textBoxRef.current?.focus();
  }, [targetId]);

  useEffect(() => {
    if (shouldCommentFocus) textBoxRef.current?.focus();
  }, [shouldCommentFocus]);

  useEffect(() => {
    setCanClose("feed", async () => {
      if (!comment || comment.trim() === "") {
        return true;
      }

      const result = await ConfirmAlert({
        title: "댓글을 작성 중이에요",
        text: `지금 나가면 작성중인 내용이<br/>저장되지 않습니다.`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "창 닫기",
        cancelButtonText: "취소",
      });

      return result.isConfirmed;
    });

    return () => {
      resetCanClose("feed");
    };
  }, [comment, resetCanClose, setCanClose]);

  const submitRegistry = useSubmitRegistry();

  useEffect(() => {
    submitRegistry?.register("comment-create", {
      submit: submitComment,
      enabled: () => !isPending,
    });

    return () => {
      submitRegistry?.unregister("comment-create");
    };
  }, [isPending, submitComment, submitRegistry]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitComment();
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      {targetNickname && (
        <div
          className={tw(
            "flex items-center gap-2 justify-between duration-300 translate-y-full opacity-0",
            targetNickname ? "translate-y-0 opacity-100" : "",
          )}
        >
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-mainblue ">
              @{targetNickname}
            </span>
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
        <div className="flex-1 flex items-center border-gray-300 leading-relaxed wrap-break-word">
          <TextBox
            submitOwner="comment-create"
            placeholder={
              userId ? "댓글을 입력해주세요." : "로그인 후 이용해주세요"
            }
            ref={textBoxRef}
            mode="comment"
            setValue={setComment}
            className="max-h-20 overflow-auto"
            isAble={!!userId}
          />
        </div>

        <div className="self-stretch py-2 relative">
          <button
            type="submit"
            className={tw(
              "h-full bg-gray-300 text-white p-2 rounded-md text-nowrap text-sm duration-150 select-none",
              comment.length > 0 ? "bg-mainblue cursor-pointer" : "bg-gray-300",
              isPending ? "bg-gray-300 text-transparent" : "",
            )}
            disabled={isPending}
          >
            {isPending ? (
              <div className="sm-gray-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              ""
            )}
            게시
          </button>
        </div>
      </div>
    </form>
  );
}
export default CommentInput;

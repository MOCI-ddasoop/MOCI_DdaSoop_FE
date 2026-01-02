"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommnetListByFeedId } from "../api/useGetCommnetListByFeedId";
import { useSearchParams } from "next/navigation";
import { useToggleReact } from "../api/useToggleReact";

function CommentContainer({
  className,
  onCommentTargetClick,
}: {
  className?: string;
  onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
}) {
  const feedId = useSearchParams().get("feedId");
  const { data: feedCommentData } = useCommnetListByFeedId(feedId);

  if (!feedCommentData) return null;

  return (
    <ul className={tw("w-full flex flex-col gap-2", className)}>
      {feedCommentData.content.map((item) => (
        <CommentItem
          key={item.id}
          item={item}
          feedId={feedId}
          onCommentTargetClick={onCommentTargetClick}
        />
      ))}
    </ul>
  );
}
export default CommentContainer;

"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommentListByFeedId } from "../api/useGetCommentListByFeedId";
import { useSearchParams } from "next/navigation";

// 피드 모달에서만 사용
function CommentContainer({
	className,
	onCommentTargetClick,
}: {
	className?: string;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
}) {
	const feedId = useSearchParams().get("feedId");
	const { data: feedCommentData } = useCommentListByFeedId(feedId);

	if (!feedCommentData) return null;

	return (
		<ul className={tw("w-full flex flex-col gap-2", className)}>
			{feedCommentData.content.map((item) => (
				<CommentItem
					key={item.id}
					item={item}
					feedId={Number(feedId)}
					onCommentTargetClick={onCommentTargetClick}
				/>
			))}
		</ul>
	);
}
export default CommentContainer;

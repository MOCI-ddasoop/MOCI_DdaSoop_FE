"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommnetListByFeedId } from "../api/useCommnetListByFeedId";
import { useSearchParams } from "next/navigation";

interface CommentItemProps {
	id: number;
	profileImage: string;
	author: string;
	date: string;
	content: string;
	className?: string;
}

function CommentContainer({
	className,
	onCommentTargetClick,
}: {
	className?: string;
	onCommentTargetClick?: (nickname: string | null) => void;
}) {
	const feedId = useSearchParams().get("feedId");
	const { data: feedCommentData } = useCommnetListByFeedId(feedId);
	console.log(feedCommentData);

	if (!feedCommentData) return null;

	return (
		<ul className={tw("w-full flex flex-col gap-2", className)}>
			{feedCommentData.content.map((item) => (
				<CommentItem
					key={item.id}
					id={item.id}
					profileImage={item.authorProfileImage}
					author={item.authorNickname}
					date={item.createdAt || ""}
					content={item.content}
					onCommentTargetClick={onCommentTargetClick}
				/>
			))}
		</ul>
	);
}
export default CommentContainer;

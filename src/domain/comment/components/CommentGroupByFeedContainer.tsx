"use client";

import { groupById } from "@/shared/utils/groupById";
import CommentItem from "./CommentItem";
import { useMemo } from "react";
import FeedSummary from "@/domain/feed/components/FeedSummary";
import { useGetCommentListByUser } from "../api/useGetCommentListByUser";

function FeedGroupCommentContainer() {
	const { data } = useGetCommentListByUser("1");

	const commentList = useMemo(() => {
		const content = data?.content || [];
		return groupById(content, "targetId");
	}, [data]);

	return (
		<ul className="flex flex-col gap-2 w-full">
			{commentList &&
				Object.keys(commentList).map((comment) => {
					const feed = commentList[comment][0];
					return (
						<div
							className="flex gap-4 w-full border-b border-gray-100 flex-1"
							key={feed.id}
						>
							<FeedSummary id={feed?.id ?? 0} className="w-1/2 h-fit" />
							<ul className="flex flex-col gap-2 w-fit flex-1">
								{commentList[comment].slice(0, 2).map((comment) => (
									<CommentItem
										item={comment}
										key={comment.id}
										className="w-full"
									/>
								))}
							</ul>
						</div>
					);
				})}
		</ul>
	);
}
export default FeedGroupCommentContainer;

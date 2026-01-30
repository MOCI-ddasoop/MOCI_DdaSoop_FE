"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommentListByFeedId } from "../api/useGetCommentListByFeedId";
import { useSearchParams } from "next/navigation";
import { useCommentScrollStore } from "../store/useCommentScrollStore";
import { useEffect, useRef } from "react";

// 피드 모달에서만 사용
function CommentContainer({
	className,
	onCommentTargetClick,
	onScrollToNewComment,
}: {
	className?: string;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	onScrollToNewComment: (target: HTMLElement) => void;
}) {
	const feedId = useSearchParams().get("feedId");
	const { data: feedCommentData } = useCommentListByFeedId(feedId);
	const {
		lastCreatedCommentId,
		setLastCreatedCommentId,
		setLastCreatedCommentParentId,
		setOpenedReplyParentId,
	} = useCommentScrollStore();
	const openedReplyParentId = useCommentScrollStore(
		(state) => state.openedReplyParentId,
	);
	const lastCreatedCommentParentId = useCommentScrollStore(
		(state) => state.lastCreatedCommentParentId,
	);
	const commentRefs = useRef<Map<number, HTMLElement>>(new Map());

	useEffect(() => {
		console.log(feedCommentData);
	}, [feedCommentData]);

	const commentCount = feedCommentData?.content.length ?? 0;

	useEffect(() => {
		if (lastCreatedCommentParentId) {
			if (openedReplyParentId !== lastCreatedCommentParentId) return;
			const target = commentRefs.current.get(lastCreatedCommentParentId);
			if (!target) return;

			onScrollToNewComment(target);
			setLastCreatedCommentId(null);
			setLastCreatedCommentParentId(null);
			setOpenedReplyParentId(null);
		} else {
			if (!lastCreatedCommentId) return;
			const target = commentRefs.current.get(lastCreatedCommentId);
			if (!target) return;
			onScrollToNewComment(target);
		}
		setLastCreatedCommentId(null);
	}, [
		lastCreatedCommentId,
		lastCreatedCommentParentId,
		onScrollToNewComment,
		setLastCreatedCommentId,
		commentCount,
		openedReplyParentId,
		setLastCreatedCommentParentId,
		setOpenedReplyParentId,
	]);

	if (!feedCommentData) return null;

	return (
		<ul className={tw("w-full flex flex-col gap-2", className)}>
			{feedCommentData.content.map((item) => (
				<CommentItem
					key={item.id}
					item={item}
					feedId={Number(feedId)}
					onCommentTargetClick={onCommentTargetClick}
					ref={(el) => {
						if (!item.id) return;
						if (el) {
							commentRefs.current.set(item.id, el);
						} else {
							commentRefs.current.delete(item.id);
						}
					}}
				/>
			))}
			<button className="py-2 text-sm text-slate-500 text-left cursor-pointer">
				댓글 불러오기
			</button>
		</ul>
	);
}
export default CommentContainer;

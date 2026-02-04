"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommentListByFeedId } from "../api/useGetCommentListByFeedId";
import { useSearchParams } from "next/navigation";
import { useCommentScrollStore } from "../store/useCommentScrollStore";
import { useEffect, useRef } from "react";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

// 피드 모달에서만 사용
function CommentContainer({
	className,
	onCommentTargetClick,
	onScrollToComment,
}: {
	className?: string;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	onScrollToComment: (target?: HTMLElement) => void;
}) {
	const feedId = useSearchParams().get("feedId");
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isPending,
	} = useCommentListByFeedId(feedId);
	const feedCommentData = data?.pages.flatMap((page) => page.content ?? []);
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

	const triggerRef = useIntersection({
		onIntersect: () => {
			fetchNextPage();
		},
		hasNextPage,
		rootMargin: "40px",
		isFetching,
	});

	useEffect(() => {
		if (lastCreatedCommentParentId) {
			if (openedReplyParentId !== lastCreatedCommentParentId) return;
			const target = commentRefs.current.get(lastCreatedCommentParentId);
			if (!target) return;

			onScrollToComment(target);
			setLastCreatedCommentId(null);
			setLastCreatedCommentParentId(null);
			setOpenedReplyParentId(null);
		} else {
			if (!lastCreatedCommentId) return;
			const target = commentRefs.current.get(lastCreatedCommentId);
			if (!target) return;
			onScrollToComment(target);
		}
		setLastCreatedCommentId(null);
	}, [
		lastCreatedCommentId,
		lastCreatedCommentParentId,
		onScrollToComment,
		setLastCreatedCommentId,
		feedCommentData,
		openedReplyParentId,
		setLastCreatedCommentParentId,
		setOpenedReplyParentId,
	]);

	if (!feedCommentData) return null;
	return (
		<ul className={tw("w-full flex flex-col gap-2", className)}>
			{feedCommentData.map((item) => (
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
			<div ref={triggerRef}>
				{isPending && (
					<div className="h-8 flex items-center">
						<div className="sm-gray-spinner translate-x-7"></div>
					</div>
				)}
				{isFetchingNextPage && (
					<div className="h-8 flex items-center">
						<div className="sm-gray-spinner translate-x-7"></div>
					</div>
				)}
				{!isPending && !hasNextPage && (
					<button
						className="flex-center gap-1 py-2 text-sm text-gray-500 text-left cursor-pointer translate-x-3"
						onClick={() => {
							onScrollToComment();
						}}
					>
						<FaRegArrowAltCircleUp />
						맨위로 가기
					</button>
				)}
			</div>
		</ul>
	);
}
export default CommentContainer;

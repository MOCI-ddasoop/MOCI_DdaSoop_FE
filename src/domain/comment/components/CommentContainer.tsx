"use client";

import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";
import { useCommentListByFeedId } from "../api/useGetCommentListByFeedId";
import { useParams, useSearchParams } from "next/navigation";
import { useCommentScrollStore } from "../provider/CommentScrollProvider";
import { useEffect, useRef } from "react";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

// 피드 모달에서만 사용
function CommentContainer({
	className,
	onCommentTargetClick,
	onScrollToComment,
	userId,
}: {
	className?: string;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	onScrollToComment: (target?: HTMLElement) => void;
	userId?: number;
}) {
	const params = useParams();
	const searchParams = useSearchParams();
	const feedId = (params?.id ?? searchParams.get("feedId")) as string;
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isPending,
	} = useCommentListByFeedId(feedId);
	const feedCommentData = data?.pages.flatMap((page) => page.content ?? []);

	const lastCreatedCommentId = useCommentScrollStore(
		(s) => s.lastCreatedCommentId,
	);
	const lastCreatedCommentParentId = useCommentScrollStore(
		(s) => s.lastCreatedCommentParentId,
	);
	const openedReplyParentId = useCommentScrollStore(
		(s) => s.openedReplyParentId,
	);
	const actions = useCommentScrollStore((s) => s.actions);

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
			requestAnimationFrame(() => {
				const target = commentRefs.current.get(lastCreatedCommentParentId);
				if (!target) return;

				onScrollToComment(target);
				actions.reset();
			});
		} else {
			if (!lastCreatedCommentId) return;
			requestAnimationFrame(() => {
				const target = commentRefs.current.get(lastCreatedCommentId);
				if (!target) return;
				onScrollToComment(target);
				actions.reset();
			});
		}
	}, [
		actions,
		lastCreatedCommentId,
		lastCreatedCommentParentId,
		onScrollToComment,
		openedReplyParentId,
		feedCommentData,
	]);

	if (!feedCommentData) return null;
	return (
		<ul className={tw("w-full flex flex-col gap-2", className)}>
			{feedCommentData.map((item) => (
				<CommentItem
					key={item.id}
					item={item}
					feedId={Number(feedId)}
					userId={userId}
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

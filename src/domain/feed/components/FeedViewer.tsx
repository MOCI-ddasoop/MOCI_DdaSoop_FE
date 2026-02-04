"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FeedDetailCard from "./FeedDetailCard";
import CommentContainer from "@/domain/comment/components/CommentContainer";
import CommentInput from "@/domain/comment/components/CommentInput";
import ImageSwiper from "@/shared/components/ImageSwiper";
import FeedImageInput from "./FeedImageInput";
import { scrollToNewComment } from "@/domain/comment/utils/scrollToNewComment";
import { FeedResponse } from "../types";
import { useFeedEditStore } from "../store/useFeedEditStore";

function FeedViewer({
	feed: feedDetailData,
}: {
	feed: FeedResponse | undefined;
}) {
	const contentRef = useRef<HTMLDivElement>(null);

	const [targetNickname, setTargetNickname] = useState<string | null>(null);
	const [targetId, setTargetId] = useState<number | null>(null);

	const isFeedEditMode = useFeedEditStore((s) => s.isEditMode);
	const editedImages = useFeedEditStore((s) => s.draft.images);
	const setEditedImages = useFeedEditStore((s) => s.setImages);

	useEffect(() => {
		const el = contentRef.current;
		return () => {
			setTargetNickname(null);
			el?.scrollTo({ top: 0 });
		};
	}, []);

	const handleCommentTargetClick = (
		nickname: string | null,
		id: number | null,
	) => {
		setTargetNickname(nickname ?? null);
		setTargetId(id ?? null);
	};

	const handleScrollToComment = useCallback((target?: HTMLElement) => {
		const container = contentRef.current;
		if (!container) return;
		if (target) {
			scrollToNewComment(container, target);
		} else {
			container.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, []);

	return (
		<>
			{/* image 영역 */}
			<div className="relative h-full w-3/5">
				{isFeedEditMode ? (
					<FeedImageInput value={editedImages} setValue={setEditedImages} />
				) : (
					<ImageSwiper
						mode="feed"
						slideList={
							feedDetailData?.images?.map((img) => ({
								imageUrl: img.imageUrl ?? "/defaultFeedImage.png",
							})) || []
						}
					/>
				)}
			</div>

			{/* content 영역 */}
			<div className="flex flex-col w-2/5 h-full bg-white">
				<div
					ref={contentRef}
					className="flex-1 overflow-y-auto overflow-x-hidden"
				>
					<FeedDetailCard item={feedDetailData ?? {}} />

					{/* comment 영역 */}
					<CommentContainer
						onCommentTargetClick={handleCommentTargetClick}
						onScrollToComment={handleScrollToComment}
					/>
				</div>

				<div className="px-2 py-1 border-t border-gray-200 bg-white">
					<CommentInput
						targetNickname={targetNickname}
						targetId={targetId}
						onCommentTargetClick={handleCommentTargetClick}
					/>
				</div>
			</div>
		</>
	);
}
export default FeedViewer;

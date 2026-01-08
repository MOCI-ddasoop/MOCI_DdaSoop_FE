"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FeedDetailCard from "./FeedDetailCard";
import CommentContainer from "@/domain/comment/components/CommentContainer";
import CommentInput from "@/domain/comment/components/CommentInput";
import { useGetFeedById } from "../api/useGetFeedById";
import ImageSwiper from "@/shared/components/ImageSwiper";

const FEED_DATA = Array.from({ length: 40 }).map((_, index) => ({
	id: 1,
	title: "Feed 1",
	author: "author 1",
	content: "Feed 1 content",
	category: "category 1",
	date: "2025년 1월 1일",
	likeCount: 10,
	commentCount: 10,
	tags: ["tag1", "tag2", "tag3"],
	likedByMe: false,
	image:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
}));

function FeedModal({
	feedId,
	onClose,
	isOpen,
}: {
	feedId: string;
	onClose: () => void;
	isOpen: boolean;
}) {
	const contentRef = useRef<HTMLDivElement>(null);
	const [targetNickname, setTargetNickname] = useState<string | null>(null);
	const [targetId, setTargetId] = useState<number | null>(null);
	const { data: feedDetailData } = useGetFeedById(feedId);

	const handleClose = () => {
		onClose();
		setTargetNickname(null);
		contentRef.current?.scrollTo({ top: 0 });
	};

	const handleCommentTargetClick = (
		nickname: string | null,
		id: number | null
	) => {
		setTargetNickname(nickname ?? null);
		setTargetId(id ?? null);
	};

	useEffect(() => {
		if (!isOpen) return;

		// ESC 키로 닫기
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose();
		};
		document.addEventListener("keydown", handleEscape);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (typeof window === "undefined") return null;

	return createPortal(
		isOpen && (
			<div
				className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
				onClick={handleClose}
			>
				<div
					className="flex w-full h-[90vh] max-w-4xl bg-white rounded-md"
					onClick={(e) => e.stopPropagation()}
				>
					{/* image 영역 */}
					<div className="relative h-full w-3/5">
						<ImageSwiper
							slideList={
								feedDetailData?.images.map((img) => ({ url: img.imageUrl })) ||
								[]
							}
						/>
					</div>

					{/* content 영역 */}
					<div className="flex flex-col w-2/5 h-full bg-white">
						<div
							ref={contentRef}
							className="flex-1 overflow-y-auto overflow-x-hidden"
						>
							<FeedDetailCard
								id={feedDetailData?.id || 0}
								content={feedDetailData?.content || ""}
								category={feedDetailData?.feedType || ""}
								date={feedDetailData?.createdAt || ""}
								likeCount={feedDetailData?.reactionCount || 0}
								bookmarkCount={feedDetailData?.bookmarkCount || 0}
								commentCount={feedDetailData?.commentCount || 0}
								bookMarkedByMe={feedDetailData?.isBookmarked || false}
								tags={feedDetailData?.tags || []}
								visiblity={feedDetailData?.visibility || "PUBLIC"}
								images={
									feedDetailData?.images.map((img) => img.imageUrl) || [
										FEED_DATA[Number(feedId)].image,
									]
								}
								author={
									feedDetailData?.authorName || FEED_DATA[Number(feedId)].author
								}
							/>

							{/* comment 영역 */}
							<CommentContainer
								onCommentTargetClick={handleCommentTargetClick}
							/>
						</div>

						<div className="p-2 border-t border-gray-200 bg-white">
							<CommentInput
								targetNickname={targetNickname}
								targetId={targetId}
								onCommentTargetClick={handleCommentTargetClick}
							/>
						</div>
					</div>
				</div>
			</div>
		),
		document.body
	);
}

export default FeedModal;

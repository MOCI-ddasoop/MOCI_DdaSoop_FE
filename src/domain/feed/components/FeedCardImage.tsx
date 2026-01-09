"use client";

import Image from "next/image";
import tw from "@/shared/utils/tw";
import { AiOutlineLock } from "react-icons/ai";
import { BsChatRight, BsHeart } from "react-icons/bs";
import { PositionedItem } from "./FeedCardContainer";

type FeedCardImageProps = PositionedItem & {
	alt: string;
	className?: string;
	onClick?: () => void;
};

function FeedCardImage({
	id,
	thumbnailUrl: src = "/defaultFeedImage.png",
	alt,
	width,
	thumbnailWidth: imageWidth = 500,
	thumbnailHeight: imageHeight = 500,
	x = 0,
	y = 0,
	content,
	commentCount,
	bookmarkCount,
	authorName = "사용자를 찾을 수 없음",
	authorProfileImage = "/defaultFeedImage.png",
	className,
	onClick,
}: FeedCardImageProps) {
	const aspectRatio = imageWidth / imageHeight;
	const height = width / aspectRatio;

	return (
		<div
			id={`${id}`}
			onClick={onClick}
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				width: width,
				height: height,
				transform: `translate(${x}px, ${y}px)`,
			}}
			className={tw(
				"bg-gray-100 rounded-md relative cursor-pointer group",
				className
			)}
		>
			<AiOutlineLock
				size={24}
				className="absolute top-2 right-2 z-20 text-gray-500/80 group-hover:text-white/80 duration-300"
			/>

			<div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 ">
				<div className="absolute flex items-center gap-2 top-2 left-0 px-4">
					<div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
						<Image
							src={authorProfileImage}
							alt={authorName}
							width={50}
							height={50}
							className="object-cover"
						/>
					</div>
					<div className="text-sm text-white text-nowrap">{authorName}</div>
				</div>
				<div className="w-full h-full flex items-center justify-center">
					<p className="text-white text-sm line-clamp-2">{content}</p>
				</div>
			</div>

			<div className="absolute bottom-4 left-0 w-full flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 ">
				<div className="flex items-center justify-between gap-2">
					<BsChatRight size={24} className="text-white" />
					<p className="text-white">{commentCount}</p>
				</div>
				<div className="flex items-center justify-between gap-2">
					<BsHeart size={24} className="text-white" />
					<p className="text-white">{bookmarkCount}</p>
				</div>
			</div>

			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover z-0"
				placeholder="empty"
			/>
		</div>
	);
}

export default FeedCardImage;

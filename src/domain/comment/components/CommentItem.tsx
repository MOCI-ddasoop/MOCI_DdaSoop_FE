"use client";

import reportModalStore from "@/domain/report/stores/reportModalStore";
import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState } from "react";

interface CommentItemProps {
	profileImage: string;
	author: string;
	date: string;
	content: string;
	onCommentTargetClick?: (nickname: string | null) => void;
	className?: string;
}

function CommentItem({
	profileImage,
	author,
	date,
	content,
	onCommentTargetClick,
	className,
}: CommentItemProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const setReportModalOpen = reportModalStore((state) => state.setIsOpen);

	const handleOptionClick = (option: string) => {
		setSelectedOption(option);
		switch (option) {
			case "수정":
				console.log("수정");
				break;
			case "삭제":
				console.log("삭제");
				break;
			case "신고":
				setReportModalOpen(true);
				break;
		}
	};

	return (
		<li
			className={tw(
				"relative flex flex-col items-start p-2 w-full border-b border-gray-100 gap-1 hover:bg-gray-100 group",
				className
			)}
		>
			<div className="flex items-center gap-2">
				<div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
					<Image
						src={profileImage}
						alt={author}
						fill
						className="object-cover"
					/>
				</div>

				{/* 유저이름, 컨텐츠 */}
				<div>
					<span className="inline font-semibold text-gray-900">{author} </span>
					<span className="inline">{content}</span>
				</div>
			</div>

			<div className="w-full flex items-center gap-2 justify-between">
				<div className="flex items-center gap-2">
					<div className="text-sm text-gray-500">{date}</div>
					<button
						type="button"
						className="cursor-pointer text-sm text-gray-500"
						onClick={() => {
							console.log("author", author);
							onCommentTargetClick?.(author ?? null);
						}}
					>
						답글
					</button>
				</div>
			</div>
			<DropdownButton
				className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				options={["수정", "삭제", "신고"]}
				selected={selectedOption ?? ""}
				setSelected={handleOptionClick}
				buttonStyle="horizontal"
				size="sm"
				menuSize="sm"
				placement="bottom-end"
				hilightingLastOption={true}
			/>
		</li>
	);
}
export default CommentItem;

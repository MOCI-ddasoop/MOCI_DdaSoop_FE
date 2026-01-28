"use client";
import tw from "@/shared/utils/tw";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

import { useSearchParams } from "next/navigation";
import { useSetComment } from "../api/useSetComment";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";

interface CommentInputProps {
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	targetNickname?: string | null;
	targetId?: number | null;
}

function CommentInput({
	targetNickname,
	targetId,
	onCommentTargetClick,
}: CommentInputProps) {
	const [comment, setComment] = useState("");
	const feedId = useSearchParams().get("feedId");
	const { mutate: setCommentMutation } = useSetComment();
	const textBoxRef = useRef<TextBoxHandle>(null);

	const submitComment = () => {
		if (!textBoxRef.current) return;
		if (!comment) return;
		if (!comment.trim()) return;

		setCommentMutation({
			commentType: "FEED",
			content: textBoxRef.current.getHTML(),
			targetId: Number(feedId),
			parentId: targetId ?? undefined,
		});

		onCommentTargetClick?.(null, null);
		textBoxRef.current?.clear();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submitComment();
	};

	const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (e.key === "Enter") {
			if (e.metaKey || e.ctrlKey) return;

			e.preventDefault();
			submitComment();
		}
	};

	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={handleSubmit}
			onKeyDown={handleEnterKeyDown}
		>
			{targetNickname && (
				<div
					className={tw(
						"flex items-center gap-2 justify-between duration-300 translate-y-full opacity-0",
						targetNickname ? "translate-y-0 opacity-100" : "",
					)}
				>
					<div className="text-sm text-gray-500">
						<span className="font-semibold text-mainblue ">
							@{targetNickname}
						</span>
						님에게 보내는 댓글
					</div>
					<button
						type="button"
						className="text-sm text-gray-500 cursor-pointer"
						onClick={() => onCommentTargetClick?.(null, null)}
					>
						<IoClose size={16} />
					</button>
				</div>
			)}
			<div className="flex justify-center items-stretch gap-2 w-full h-full">
				<div className="flex-1 flex items-center border-gray-300">
					<TextBox
						placeholder="댓글을 입력해주세요."
						ref={textBoxRef}
						mode="comment"
						setValue={setComment}
						className="max-h-20 overflow-auto"
					/>
				</div>

				<div className="self-stretch py-2">
					<button
						type="submit"
						className={tw(
							"h-full bg-gray-300 text-white p-2 rounded-md text-nowrap text-sm duration-150",
							comment.length > 0 ? "bg-mainblue cursor-pointer" : "bg-gray-300",
						)}
					>
						게시
					</button>
				</div>
			</div>
		</form>
	);
}
export default CommentInput;

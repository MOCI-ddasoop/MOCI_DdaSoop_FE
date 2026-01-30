"use client";

import reportModalStore from "@/domain/report/stores/reportModalStore";
import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useToggleReact } from "../api/useToggleReact";
import { CommentResponse } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import { useUdtCommentById } from "../api/useUdtCommentById";
import { useDelCommentById } from "../api/useDelCommentById";
import Swal from "sweetalert2";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import { useCommentScrollStore } from "../store/useCommentScrollStore";
import { formatRelativeDate } from "@/shared/utils/timeFormatRelativeDate";

interface CommentItemProps {
	ref?: Ref<HTMLLIElement>;
	item: CommentResponse;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	feedId?: number;
	className?: string;
	isRelies?: boolean;
}

function CommentItem({
	ref: outRef,
	item,
	onCommentTargetClick,
	feedId,
	className,
	isRelies,
}: CommentItemProps) {
	const {
		id,
		authorName,
		authorNickname,
		authorProfileImage,
		content,
		createdAt,
		replies,
		replyCount,
		parentId,
	} = item;

	const qc = useQueryClient();

	const [reactionCount, setReactionCount] = useState<number>(
		() => item.reactionCount ?? 0,
	);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const setReportModalOpen = reportModalStore((state) => state.setIsOpen);
	const textBoxRef = useRef<TextBoxHandle>(null);

	const { lastCreatedCommentParentId, setOpenedReplyParentId } =
		useCommentScrollStore();

	const { mutate: toggleReactMutation, isPending } = useToggleReact({
		onSuccess: () => {
			if (!feedId) return;

			qc.invalidateQueries({
				queryKey: queryKeys.comments.list(`${feedId}`),
			});
		},
		onMutate: () => {
			setReactionCount((prev) => prev + 1);
		},
		onError: () => {
			setReactionCount((prev) => prev - 1);
		},
	});

	const { mutate: updateCommentMutation } = useUdtCommentById(feedId);
	const { mutate: deleteCommentMutation } = useDelCommentById(feedId);

	const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		Swal.fire({
			title: "수정",
			text: "댓글을 수정하시겠습니까?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "수정",
			cancelButtonText: "취소",
		}).then((result) => {
			if (result.isConfirmed) {
				if (!id) return;
				updateCommentMutation({
					id,
					content: textBoxRef.current?.getHTML() ?? "",
				});
				setIsEditMode(false);
			}
		});
	};
	useEffect(() => {
		if (item.id === lastCreatedCommentParentId) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsRepliesOpen(true);
			setOpenedReplyParentId(item.id!);
		}
	}, [item.id, lastCreatedCommentParentId, setOpenedReplyParentId]);

	const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (e.key === "Enter") {
			if (e.metaKey || e.ctrlKey) return;

			e.preventDefault();
			handleEditSubmit(e);
		}
	};

	useEffect(() => {
		if (!isEditMode) return;
		textBoxRef.current?.focus();
	}, [isEditMode]);

	// 이곳에서 드롭다운 메뉴 이벤트가 처리됩니다.
	const handleOptionClick = (option: string) => {
		setSelectedOption(option);
		switch (option) {
			case "수정":
				setIsEditMode(true);
				break;
			case "삭제":
				Swal.fire({
					title: "삭제",
					text: "댓글을 삭제하시겠습니까?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "삭제",
					cancelButtonText: "취소",
				}).then((result) => {
					if (result.isConfirmed) {
						deleteCommentMutation({ id });
					}
				});
				break;
			case "신고":
				setReportModalOpen(true);
				break;
		}
	};

	return (
		<li ref={outRef} data-comment-id={item.id} className="flex gap-1 w-full">
			{isRelies && <div className="w-1 h-full bg-gray-300"></div>}
			<div
				className={tw(
					"relative flex flex-col items-start pt-2 pb-1 px-1 w-full border-b border-gray-100 gap-1 hover:bg-gray-100 group",
					className,
				)}
			>
				<div className="flex gap-2 w-full">
					<div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
						<Image
							src={authorProfileImage ?? "/defaultFeedImage.png"}
							alt={authorName ?? "사용자를 찾을 수 없습니다."}
							fill
							className="object-cover"
						/>
					</div>

					{/* 유저이름, 컨텐츠 */}
					<div className="flex-1 flex gap-2">
						{isEditMode ? (
							<form
								className="flex-center flex-col items-end w-full"
								onSubmit={(e) => handleEditSubmit(e)}
								onKeyDown={handleEnterKeyDown}
							>
								<TextBox
									ref={textBoxRef}
									className="flex-1"
									mode="comment"
									initialValue={content}
								/>
								<div className="flex-center gap-1 text-sm">
									<span className="text-gray-400">Enter 키로</span>
									<button className="text-mainblue underline">수정</button>
								</div>
							</form>
						) : (
							<>
								<span
									className="inline font-semibold text-gray-900 cursor-pointer"
									onClick={() => {
										if (!parentId) {
											onCommentTargetClick?.(
												authorNickname ?? null,
												id ?? null,
											);
											textBoxRef.current?.focus();
										} else {
											onCommentTargetClick?.(null, null);
										}
									}}
								>
									{authorName}
								</span>
								<span
									className="inline"
									dangerouslySetInnerHTML={{
										__html: sanitizeHtml(content ?? ""),
									}}
								></span>
							</>
						)}
					</div>
				</div>

				<div className="w-full flex items-center gap-2 justify-between">
					<div className="flex items-center w-full gap-2 pl-2">
						{/* TODO: createAt 임시 비활성화. 날짜 로그가 추가되면 다시 추가(옵션이 다른건지... 렌더링이 안됨.) */}
						<div className="text-sm text-gray-500">
							{formatRelativeDate(createdAt ?? "")}
						</div>
						{!parentId ? (
							<button
								type="button"
								className="cursor-pointer text-sm text-gray-500"
								onClick={() => {
									onCommentTargetClick?.(authorNickname ?? null, id ?? null);
									textBoxRef.current?.focus();
									setIsRepliesOpen((prev) => {
										if (!prev === false) {
											onCommentTargetClick?.(null, null);
										}
										return !prev;
									});
								}}
							>
								답글 {replyCount}
							</button>
						) : (
							""
						)}
						<button
							type="button"
							className="cursor-pointer text-sm text-gray-500 active:scale-95 transition-transform"
							onClick={() => {
								toggleReactMutation(id ?? 0);
							}}
							disabled={isPending}
						>
							좋아요 {reactionCount}
						</button>
					</div>
					{/* TODO: 수정, 삭제 기능은 로그인이 연결되었을 때, ME로 작성자 ID와 내 아이디 비교하여 렌더링 */}
					<DropdownButton
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						options={["수정", "삭제", "신고"]}
						selected={selectedOption ?? ""}
						setSelected={handleOptionClick}
						buttonStyle="horizontal"
						size="sm"
						menuSize="sm"
						placement="bottom-end"
						highlightingLastOption={true}
					/>
				</div>

				{/* 대댓글이 있다면 재귀적으로 호출 
          TODO: 답글에 답글까지는(depth 2 이상의 replies) 불러오지 못 하는 것으로 보임. 개선 필요
        */}
				{replies && replies.length > 0 && isRepliesOpen && (
					<ul className="pl-2 mt-2 flex flex-col gap-2 border-l-2 w-full border-slate-500">
						{replies.map((reply) => (
							<CommentItem
								key={reply.id}
								item={reply}
								feedId={feedId}
								onCommentTargetClick={onCommentTargetClick}
							/>
						))}
						<button
							className="text-sm text-slate-500 text-left cursor-pointer"
							onClick={() => {
								setIsRepliesOpen(false);
								onCommentTargetClick?.(null, null);
							}}
						>
							답글 숨기기
						</button>
					</ul>
				)}
			</div>
		</li>
	);
}
export default CommentItem;

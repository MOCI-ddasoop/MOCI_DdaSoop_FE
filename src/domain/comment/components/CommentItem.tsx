"use client";

import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import React, { Ref, useCallback, useEffect, useRef, useState } from "react";
import { useToggleReact } from "../api/useToggleReact";
import { CommentResponse } from "../types";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import { useUdtCommentById } from "../api/useUdtCommentById";
import { useDelCommentById } from "../api/useDelCommentById";
import Swal from "sweetalert2";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import { BsHeartFill } from "react-icons/bs";

import { formatRelativeDate } from "@/shared/utils/timeFormatRelativeDate";
import { useSubmitRegistry } from "@/domain/feed/provider/SubmitRegistryProvider";
import { useModalStore } from "@/domain/modal/store/useModalStore";
import reportModalStore from "@/domain/report/stores/useReportModalStore";

interface CommentItemProps {
	ref?: Ref<HTMLLIElement>;
	item: CommentResponse;
	onCommentTargetClick?: (nickname: string | null, id: number | null) => void;
	feedId?: number;
	className?: string;
	isRelies?: boolean;
	userId?: number;
}

function CommentItem({
	ref: outRef,
	item,
	onCommentTargetClick,
	feedId,
	className,
	isRelies,
	userId,
}: CommentItemProps) {
	const {
		id,
		authorId,
		authorNickname,
		authorProfileImage,
		content,
		createdAt,
		updatedAt,
		replies,
		replyCount,
		parentId,
		reactionCount,
		isReacted,
	} = item;

	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const textBoxRef = useRef<TextBoxHandle>(null);
	const openStoreModal = useModalStore((store) => store.open);
	const setCanClose = useModalStore((s) => s.setCanClose);
	const resetCanClose = useModalStore((s) => s.resetCanClose);
	const reportAction = reportModalStore((s) => s.action);

	const { mutate: toggleReactMutation, isPending: isToggleReactPending } =
		useToggleReact(feedId);

	const { mutate: updateCommentMutation, isPending: isUdtCommentPending } =
		useUdtCommentById(feedId);
	const { mutate: deleteCommentMutation } = useDelCommentById(feedId);

	const editFormSubmit = useCallback(() => {
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
	}, [id, updateCommentMutation]);

	const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		editFormSubmit();
	};

	const submitRegistry = useSubmitRegistry();

	useEffect(() => {
		if (!submitRegistry) return;
		submitRegistry.register("comment-edit", {
			submit: editFormSubmit,
			enabled: () => isEditMode && !isUdtCommentPending,
		});
	}, [editFormSubmit, isEditMode, isUdtCommentPending, submitRegistry]);

	useEffect(() => {
		if (!isEditMode) return;
		textBoxRef.current?.focus();
	}, [isEditMode]);

	useEffect(() => {
		if (!isEditMode) return;

		setCanClose("feed", async () => {
			const result = await Swal.fire({
				icon: "error",
				titleText: "수정 중인 내용이 있어요",
				text: "지금 나가면 수정 내용이 저장되지 않습니다.",
				showCancelButton: true,
				showDenyButton: true,
				showConfirmButton: true,
				confirmButtonText: "창 닫기",
				denyButtonText: "수정 취소",
				cancelButtonText: "취소",
			});

			if (result.isConfirmed) {
				return true;
			}

			if (result.isDenied) {
				setIsEditMode(false);
				return false;
			}

			return false;
		});

		return () => resetCanClose("feed");
	}, [isEditMode, resetCanClose, setCanClose]);

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
				if (!id) return;
				reportAction.setReportTarget("COMMENT", id);
				openStoreModal("report");
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
							alt={authorNickname ?? "사용자를 찾을 수 없습니다."}
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
							>
								<TextBox
									submitOwner="comment-edit"
									ref={textBoxRef}
									className="flex-1"
									mode="comment"
									initialValue={content}
								/>
								<div className="flex-center gap-1 text-sm">
									<span className="text-gray-400">Enter 키로</span>
									<button className="text-mainblue underline cursor-pointer">
										수정
									</button>
									<button
										className="text-mainblue underline cursor-pointer"
										onClick={() => setIsEditMode(false)}
									>
										취소
									</button>
								</div>
							</form>
						) : (
							<div className="leading-relaxed wrap-break-word">
								<span
									className="inline font-semibold text-gray-900 cursor-pointer mr-1.5"
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
									{authorNickname}
								</span>
								<span
									className="inline"
									dangerouslySetInnerHTML={{
										__html: sanitizeHtml(content ?? ""),
									}}
								></span>
								{updatedAt !== createdAt ? (
									<span className="text-gray-400 ml-1 text-sm">(수정됨)</span>
								) : (
									""
								)}
							</div>
						)}
					</div>
				</div>

				<div className="w-full flex items-center gap-2 justify-between">
					<div className="flex items-center w-full gap-2 pl-2">
						<div className="text-sm text-gray-500">
							{formatRelativeDate(createdAt ?? "")}
						</div>
						{!parentId ? (
							<button
								type="button"
								className="cursor-pointer text-sm text-gray-500"
								onClick={() => {
									if (isRepliesOpen) {
										onCommentTargetClick?.(null, null);
									} else {
										onCommentTargetClick?.(authorNickname ?? null, id ?? null);
										textBoxRef.current?.focus();
									}
									setIsRepliesOpen((prev) => !prev);
								}}
							>
								답글 {replyCount}
							</button>
						) : (
							""
						)}
						<button
							type="button"
							className={tw(
								"cursor-pointer text-sm text-gray-500 active:scale-95 transition-transform flex-center gap-1",
								isReacted ? "text-mainblue" : "",
							)}
							onClick={async () => {
								if (!userId) return;
								toggleReactMutation(id ?? 0);
							}}
							disabled={isToggleReactPending}
						>
							{isReacted && <BsHeartFill size={14} />}
							좋아요 {reactionCount}
						</button>
					</div>
					{/* TODO: 수정, 삭제 기능은 로그인이 연결되었을 때, ME로 작성자 ID와 내 아이디 비교하여 렌더링 */}
					{!!userId && (
						<DropdownButton
							className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							options={
								userId === authorId ? ["수정", "삭제", "신고"] : ["신고"]
							}
							selected={selectedOption ?? ""}
							setSelected={handleOptionClick}
							buttonStyle="horizontal"
							size="sm"
							menuSize="sm"
							placement="bottom-end"
							highlightingLastOption={true}
						/>
					)}
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

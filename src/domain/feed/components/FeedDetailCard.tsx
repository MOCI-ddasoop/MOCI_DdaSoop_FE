import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { BsChatRight, BsHeart, BsHeartFill } from "react-icons/bs";
// import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { MdIosShare } from "react-icons/md";
import { useToggleFeedBookmark } from "../api/useToggleFeedBookmark";
import { FeedResponse } from "../types";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { formatRelativeDate } from "@/shared/utils/timeFormatRelativeDate";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import TagInput from "@/shared/components/TagInput";
import Swal from "sweetalert2";
import { useUpdateFeedById } from "../api/useUdtFeedById";
import { useDeleteFeedById } from "../api/useDelFeedById";
import { useModalStore } from "../../modal/store/useModalStore";
import { useRouter } from "next/navigation";
import PostVisibilityOptions from "./PostVisibilityOptions";
import { useFeedEditStore } from "../provider/FeedEditStoreProvider";
import { useSubmitRegistry } from "../provider/SubmitRegistryProvider";
import { useToggleFeedReact } from "../api/useToggleFeedReact";
import reportModalStore from "@/domain/report/stores/useReportModalStore";

type FeedDetailCardProps = {
	item: FeedResponse;
	className?: string;
	onCommentFocus?: () => void;
	userId?: number;
};

function FeedDetailCard({
	item,
	className,
	onCommentFocus,
	userId,
}: FeedDetailCardProps) {
	const {
		id,
		authorId,
		authorName: author,
		authorProfileImage = "/defaultFeedImage.png",
		content,
		createdAt,
		updatedAt,
		bookmarkCount = 0,
		reactionCount = 0,
		commentCount = 0,
		isBookmarked: bookMarkedByMe = false,
		isReacted: reactedMarkByMe = false,
		togetherId,
		togetherTitle,
		togetherCategory,
		togetherMode,
		tags,
	} = item;

	const [bookmarkInfo, setBookmarkInfo] = useState<{
		bookmarkCount: number;
		bookMarkedByMe: boolean;
	}>({
		bookmarkCount: bookmarkCount,
		bookMarkedByMe: bookMarkedByMe,
	});
	const [reactionInfo, setReactionInfo] = useState<{
		reactionCount: number;
		reactedMarkByMe: boolean;
	}>({
		reactionCount: reactionCount,
		reactedMarkByMe: reactedMarkByMe,
	});
	const router = useRouter();
	const textBoxRef = useRef<TextBoxHandle>(null);

	const closeStoreModal = useModalStore((store) => store.close);
	const openStoreModal = useModalStore((store) => store.open);

	const reportAction = reportModalStore((s) => s.action);

	const isFeedEditMode = useFeedEditStore((s) => s.isEditMode);
	const draft = useFeedEditStore((s) => s.draft);
	const editActions = useFeedEditStore((s) => s.actions);
	const {
		content: editedContent,
		tags: editedTags,
		visibility: editedVisibility,
	} = draft;
	const setCanClose = useModalStore((s) => s.setCanClose);
	const resetCanClose = useModalStore((s) => s.resetCanClose);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setBookmarkInfo({
			bookmarkCount,
			bookMarkedByMe,
		});
	}, [bookmarkCount, bookMarkedByMe]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setReactionInfo({
			reactionCount,
			reactedMarkByMe,
		});
	}, [reactionCount, reactedMarkByMe]);

	useEffect(() => {
		if (!isFeedEditMode) return;

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
				editActions.exitEdit();
				return false;
			}

			return false;
		});

		return () => resetCanClose("feed");
	}, [editActions, isFeedEditMode, resetCanClose, setCanClose]);

	const [selectedOwnerOption, setSelectedOwnerOption] = useState<string | null>(
		null,
	);
	const { mutate: toggleBookmarkMutate, isPending: isToggleBookmarkPending } =
		useToggleFeedBookmark();

	const handleBookmark = () => {
		if (!id) return;
		setBookmarkInfo((prev) => ({
			bookmarkCount: prev.bookMarkedByMe
				? prev.bookmarkCount - 1
				: prev.bookmarkCount + 1,
			bookMarkedByMe: !prev.bookMarkedByMe,
		}));

		toggleBookmarkMutate(id.toString());
	};

	const { mutate: toggleReactionMutate, isPending: isToggleReactionPending } =
		useToggleFeedReact();

	const handleReaction = () => {
		if (!id) return;
		setReactionInfo((prev) => ({
			reactionCount: prev.reactedMarkByMe
				? prev.reactionCount - 1
				: prev.reactionCount + 1,
			reactedMarkByMe: !prev.reactedMarkByMe,
		}));

		toggleReactionMutate(id.toString());
	};

	const { mutate: updateFeedMutation } = useUpdateFeedById();
	const { mutateAsync: deleteFeedMutation } = useDeleteFeedById();

	const handleDelete = async () => {
		try {
			await deleteFeedMutation({ id });
			closeStoreModal();
			router.back();
		} catch (e) {}
	};

	// 옵션은 switch문으로 처리
	const handleOwnerOptionClick = (option: string) => {
		setSelectedOwnerOption(option);
		switch (option) {
			case "수정":
				editActions.enterEdit();
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
						handleDelete();
					}
				});
				break;
			case "신고":
				if (!id) return;
				reportAction.setReportTarget("FEED", id);
				openStoreModal("report");
				break;
		}
	};

	const handleEditSubmit = useCallback(() => {
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
				const payload = editActions.toUpdatePayload(
					textBoxRef.current?.getHTML() ?? "",
				);
				updateFeedMutation({ id, content: payload });
				editActions.exitEdit();
			}
		});
	}, [editActions, id, updateFeedMutation]);

	const submitRegistry = useSubmitRegistry();

	const handleTogetherItemClick = useCallback(() => {
		window.open(`/together/${togetherId}`, "_blank", "noopener,noreferrer");
	}, [togetherId]);

	useEffect(() => {
		submitRegistry?.register("feed-edit", {
			submit: handleEditSubmit,
			enabled: () =>
				isFeedEditMode && !isToggleBookmarkPending && !isToggleReactionPending,
		});
	}, [
		handleEditSubmit,
		isFeedEditMode,
		isToggleBookmarkPending,
		isToggleReactionPending,
		submitRegistry,
	]);

	return (
		<div className={tw("bg-white h-fit", className)}>
			{/* 작성자 정보 영역 */}
			<div className="flex items-center gap-2 border-b border-gray-200 p-4 justify-between">
				<div className="flex items-center gap-2">
					<div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
						<Image src={authorProfileImage} alt={author ?? "기본이미지"} fill />
					</div>
					<div className="text-sm text-nowrap">{author}</div>
				</div>
				{!!userId && (
					<DropdownButton
						options={userId === authorId ? ["수정", "삭제", "신고"] : ["신고"]}
						selected={selectedOwnerOption ?? ""}
						setSelected={handleOwnerOptionClick}
						size="md"
						menuSize="md"
						placement="bottom-end"
						highlightingLastOption={true}
					/>
				)}
			</div>

			{/* 컨텐츠 영역 */}
			<div className="border-b border-gray-200 p-2">
				{/* 내용 영역 */}
				<div className="p-2 min-h-[100px]">
					{isFeedEditMode ? (
						<TextBox
							submitOwner="feed-edit"
							ref={textBoxRef}
							mode="comment"
							initialValue={editedContent}
						/>
					) : (
						<p
							dangerouslySetInnerHTML={{ __html: sanitizeHtml(content ?? "") }}
						/>
					)}
				</div>

				{/* 모임 정보 영역 */}
				{togetherId && (
					<TogetherListItem
						id={togetherId}
						image={
							// togetherInfo.data.thumbnailImage[0].imageUrl ??
							"/defaultFeedImage.png"
						}
						name={togetherTitle ?? "함께하기를 찾을수 없습니다."}
						category={togetherCategory ?? ""}
						isOnline={togetherMode ?? ""}
						onClick={handleTogetherItemClick}
						widthClass="w-full"
					/>
				)}

				{/* 태그 영역 */}
				<div className="flex items-center gap-2 flex-wrap p-1">
					{isFeedEditMode ? (
						<TagInput
							initialValue={editedTags}
							onTagChanged={editActions.setTags}
						/>
					) : (
						<>
							{tags?.map((tag) => (
								<span
									key={tag}
									className="text-mainblue cursor-pointer hover:underline"
								>
									#{tag}
								</span>
							))}
						</>
					)}
				</div>
				{isFeedEditMode ? (
					<PostVisibilityOptions
						togetherInfo={undefined}
						value={editedVisibility}
						setValue={editActions.setVisibility}
						userId={userId}
					/>
				) : (
					""
				)}

				<div className="flex w-full justify-between">
					{/* 날짜 영역 */}
					<div className="text-sm text-gray-500 p-1">
						{formatRelativeDate(createdAt ?? "")}
						{createdAt !== updatedAt ? (
							<span className="ml-1">(수정됨)</span>
						) : (
							""
						)}
					</div>
					{isFeedEditMode ? (
						<div className="flex-center gap-1 text-sm">
							<span className="text-gray-400">Enter 키로</span>
							<button
								className="text-mainblue underline cursor-pointer"
								onClick={handleEditSubmit}
							>
								수정
							</button>
							<button
								className="text-mainblue underline cursor-pointer"
								onClick={() => editActions.exitEdit()}
							>
								취소
							</button>
						</div>
					) : (
						""
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 py-1 px-2 border-b border-gray-200 justify-between">
				<div className="flex items-center gap-2">
					{/* 댓글 영역 */}
					<button
						type="button"
						className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
						onClick={() => onCommentFocus?.()}
					>
						<BsChatRight size={24} className="group-hover:text-amber-700" />
						<p className="group-hover:text-amber-700">{commentCount}</p>
					</button>

					{/* 좋아요 영역 */}
					<button
						type="button"
						className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
						onClick={handleReaction}
					>
						<div className="relative w-6 h-6">
							<BsHeartFill
								size={24}
								className={tw(
									"group-hover:text-amber-700 transition absolute",
									reactionInfo.reactedMarkByMe ? "opacity-100" : "opacity-0",
								)}
							/>
							<BsHeart
								size={24}
								className={tw(
									"group-hover:text-amber-700 transition absolute",
									reactionInfo.reactedMarkByMe ? "opacity-0" : "opacity-100",
								)}
							/>
						</div>
						<p className="group-hover:text-amber-700">
							{reactionInfo.reactionCount}
						</p>
					</button>

					{/* 북마크 영역 */}
					<button
						type="button"
						className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
						onClick={handleBookmark}
					>
						<div className="relative w-6 h-6">
							<IoBookmark
								size={26}
								className={tw(
									"group-hover:text-amber-700 transition absolute",
									bookmarkInfo.bookMarkedByMe ? "opacity-100" : "opacity-0",
								)}
							/>
							<IoBookmarkOutline
								size={26}
								className={tw(
									"group-hover:text-amber-700 transition absolute",
									bookmarkInfo.bookMarkedByMe ? "opacity-0" : "opacity-100",
								)}
							/>
						</div>
						<p className="group-hover:text-amber-700">
							{bookmarkInfo.bookmarkCount}
						</p>
					</button>
				</div>

				<button type="button" className="cursor-pointer duration-100 group">
					<MdIosShare
						size={24}
						className="text-gray-500 group-hover:text-amber-700"
					/>
				</button>
			</div>
		</div>
	);
}

export default FeedDetailCard;

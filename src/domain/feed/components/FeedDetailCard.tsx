import DropdownButton from "@/shared/components/DropdownButton";
import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { BsChatRight } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { MdIosShare } from "react-icons/md";
import { useToggleFeedBookmark } from "../api/useToggleFeedBookmark";
import { FeedResponse } from "../types";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { formatRelativeDate } from "@/shared/utils/timeFormatRelativeDate";
import { useFeedEditStore } from "../store/useFeedEditStore";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import TagInput from "@/shared/components/TagInput";
import Swal from "sweetalert2";
import { useUpdateFeedById } from "../api/useUdtFeedById";
import { useDeleteFeedById } from "../api/useDelFeedById";
import { useModalStore } from "../store/useModalStore";
import { useRouter } from "next/navigation";
import PostVisibilityOptions from "./PostVisibilityOptions";

type FeedDetailCardProps = {
	item: FeedResponse;
	className?: string;
};

function FeedDetailCard({ item, className }: FeedDetailCardProps) {
	const {
		id,
		authorName: author,
		authorProfileImage = "/defaultFeedImage.png",
		content,
		createdAt,
		updatedAt,
		bookmarkCount = 0,
		commentCount = 0,
		isBookmarked: bookMarkedByMe = false,
		togetherTitle,
		togetherId,
		tags,
	} = item;
	const [bookmarkInfo, setBookmarkInfo] = useState<{
		bookmarkCount: number;
		bookMarkedByMe: boolean;
	}>({
		bookmarkCount: bookmarkCount,
		bookMarkedByMe: bookMarkedByMe,
	});
	const router = useRouter();
	const textBoxRef = useRef<TextBoxHandle>(null);

	const closeStoreModal = useModalStore((store) => store.close);
	const enterEdit = useFeedEditStore((s) => s.enterEdit);
	const exitEdit = useFeedEditStore((s) => s.exitEdit);
	const isFeedEditMode = useFeedEditStore((s) => s.isEditMode);
	const editedContent = useFeedEditStore((s) => s.draft.content);
	const editedImages = useFeedEditStore((s) => s.draft.images);
	const editedTags = useFeedEditStore((s) => s.draft.tags);
	const editedVisibility = useFeedEditStore((s) => s.draft.visibility);
	const setEditedTags = useFeedEditStore((s) => s.setTags);
	const setEditedVisibility = useFeedEditStore((s) => s.setVisibility);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setBookmarkInfo({
			bookmarkCount,
			bookMarkedByMe,
		});
	}, [bookmarkCount, bookMarkedByMe]);

	const [selectedOwnerOption, setSelectedOwnerOption] = useState<string | null>(
		null,
	);
	const { mutate: toggleBookmarkMutate } = useToggleFeedBookmark();

	const handleLike = () => {
		if (!id) return;
		setBookmarkInfo((prev) => ({
			bookmarkCount: prev.bookMarkedByMe
				? prev.bookmarkCount - 1
				: prev.bookmarkCount + 1,
			bookMarkedByMe: !prev.bookMarkedByMe,
		}));

		toggleBookmarkMutate(id.toString());
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
				enterEdit();
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
				console.log("신고");
				break;
		}
	};

	const handleEditSubmit = () => {
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
				const editedData = {
					id,
					content: {
						content: textBoxRef.current?.getHTML() ?? "",
						images: editedImages.map((img, index) => {
							if (
								!img.imageUrl ||
								img.width == undefined ||
								img.height == undefined
							)
								throw new Error("이미지 메타데이터가 완성되지 않았습니다.");
							return {
								imageUrl: img.imageUrl,
								width: img.width,
								height: img.height,
								displayOrder: index,
								fileSize: img.fileSize,
								originalFileName: img.originalFileName,
							};
						}),
						visibility: editedVisibility,
						tags: editedTags,
					},
				};
				updateFeedMutation(editedData);
				exitEdit();
			}
		});
	};

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
				<DropdownButton
					options={["수정", "삭제", "신고"]}
					selected={selectedOwnerOption ?? ""}
					setSelected={handleOwnerOptionClick}
					size="md"
					menuSize="md"
					placement="bottom-end"
					highlightingLastOption={true}
				/>
			</div>

			{/* 컨텐츠 영역 */}
			<div className="border-b border-gray-200 p-2">
				{/* 내용 영역 */}
				<div className="p-2 min-h-[100px]">
					{isFeedEditMode ? (
						<TextBox
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
				{togetherId && togetherTitle && (
					<TogetherListItem
						id={togetherId ?? 1}
						image={""}
						name={togetherTitle ?? "예시입니다"}
						category={""}
						isOnline={""}
						href={"/together"}
					/>
				)}

				{/* 태그 영역 */}
				<div className="flex items-center gap-2 flex-wrap p-1">
					{isFeedEditMode ? (
						<TagInput initialValue={editedTags} onTagChanged={setEditedTags} />
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
						setValue={setEditedVisibility}
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
								className="text-mainblue underline"
								onClick={handleEditSubmit}
								// onKeyDown={}
							>
								수정
							</button>
							<button
								className="text-mainblue underline"
								onClick={() => exitEdit()}
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
					>
						<BsChatRight size={24} className="group-hover:text-amber-700" />
						<p className="group-hover:text-amber-700">{commentCount}</p>
					</button>

					{/* 좋아요 영역 */}
					<button
						type="button"
						className="flex items-center gap-2 p-2 text-gray-500 group cursor-pointer duration-100"
						onClick={handleLike}
					>
						<div className="relative w-6 h-6">
							<FaBookmark
								size={24}
								className={tw(
									"group-hover:text-amber-700 transition absolute",
									bookmarkInfo.bookMarkedByMe ? "opacity-100" : "opacity-0",
								)}
							/>
							<FaRegBookmark
								size={24}
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

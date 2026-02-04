"use client";
import FeedImageInput from "./FeedImageInput";
import {
	RefObject,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import TextBox, { TextBoxHandle } from "../../../shared/components/TextBox";
import Button from "../../../shared/components/Button";
import TagInput from "../../../shared/components/TagInput";
import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { FeedCreateRequest } from "../types";
import { ImageUploadResponse } from "@/shared/types/types";
import Swal, { SweetAlertResult } from "sweetalert2";
import { usePostFeed } from "../api/usePostFeed";
import { useGetTogetherList } from "@/domain/together/api/useGetTogetherList";
import { useAuthStore } from "@/store/authStore";
import PostVisibilityOptions from "./PostVisibilityOptions";

export interface FeedOptionData {
	together: Together;
	user: {
		role: string;
		IsCheckedIn: boolean;
	};
}

export interface CreateFeedModalRef {
	canClose: () => Promise<boolean | SweetAlertResult<boolean>>;
}

function FeedCreatorModal({
	ref,
	initialTogetherInfo,
	onClose,
	userTogetherList,
}: {
	ref: RefObject<CreateFeedModalRef | null>;
	initialTogetherInfo?: FeedOptionData;
	onClose: () => void;
	userTogetherList?: FeedOptionData[];
}) {
	const [feedImages, setFeedImages] = useState<ImageUploadResponse[]>([]);
	const [selectedTogether, setSelectedTogether] = useState<string>("main");
	const [textBoxValue, setTextBoxValue] = useState<string>();
	const [tagsValue, setTagsValue] = useState<string[]>();
	const [togetherInfo, setTogetherInfo] = useState<FeedOptionData | undefined>(
		initialTogetherInfo,
	);
	const textBoxRef = useRef<TextBoxHandle>(null);
	const [selectedPostVisibility, setSelectedPostVisibility] = useState<
		FeedCreateRequest["visibility"] | null
	>("PUBLIC");

	const { me } = useAuthStore();
	const userId = me?.memberId;
	const { data: togetherInfoFromUserId } = useGetTogetherList({ userId });

	useEffect(() => {
		console.log(me);
		console.log(togetherInfoFromUserId);
	}, [togetherInfoFromUserId, me]);

	const { mutate: postFeed, isPending } = usePostFeed({
		onMutate: () => {
			Swal.fire({
				title: "업로드 중입니다.",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});
		},
		onSuccess: () => {
			Swal.hideLoading();
			Swal.update({
				title: "업로드 성공",
				icon: "success",
			});
			setTimeout(() => {
				Swal.close();
				textBoxRef.current?.clear();
				onClose();
			}, 1500);
		},
		onError: () => {
			Swal.hideLoading();
			Swal.update({
				title: "업로드 실패",
				icon: "error",
			});
			setTimeout(() => {
				Swal.close();
			}, 1500);
		},
	});

	useImperativeHandle(ref, () => {
		return {
			canClose: async () => {
				if (
					feedImages.length === 0 &&
					(!textBoxValue || textBoxValue.trim() === "")
				) {
					return true;
				} else {
					const result = await Swal.fire({
						icon: "error",
						titleText: "게시물을 삭제하시겠습니까?",
						text: "지금 나가면 수정 내용이 저장되지 않습니다.",
						showCancelButton: true,
						showConfirmButton: true,
						confirmButtonText: "삭제",
						cancelButtonText: "취소",
					});
					return result.isConfirmed;
				}
			},
		};
	});

	const handleFeedFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedPostVisibility) return;
		const feedFormData: FeedCreateRequest = {
			feedType: "GENERAL",
			content: textBoxRef.current?.getHTML() || "",
			images: feedImages.map((img, index) => {
				if (!img.imageUrl || img.width == undefined || img.height == undefined)
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
			visibility: selectedPostVisibility,
			tags: tagsValue || [],
			togetherId:
				selectedTogether === "main" ? undefined : parseInt(selectedTogether),
		};
		postFeed(feedFormData);
	};

	const handleTogetherSelectionChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = e.target.value;
		setSelectedTogether(value);
		const selected = userTogetherList?.find(
			(i) => i.together.id.toString() === value,
		);
		setTogetherInfo(selected ?? undefined);

		let checkedPostVisibility = document.querySelector(
			'input[name="postVisibility"]:checked',
		);
		if (!checkedPostVisibility) setSelectedPostVisibility(null);
		checkedPostVisibility = null;
	};

	const handleTogetherItemClick = (e: React.MouseEvent) => {
		e.preventDefault();

		window.open(togetherInfo?.together.href, "noopener,noreferrer");
	};

	// 함께하기 선택 옵션
	const selectTogetherOption = initialTogetherInfo ? (
		<option defaultValue={initialTogetherInfo.together.id}>
			{initialTogetherInfo.together.name.length > 7
				? initialTogetherInfo.together.name.slice(0, 7) + "…"
				: initialTogetherInfo.together.name}
		</option>
	) : (
		<>
			<option value="main" defaultValue={"main"}>
				개인 피드
			</option>
			{userTogetherList?.map(({ together: { id, name } }) => (
				<option key={id} value={id}>
					{name.length > 7 ? name.slice(0, 7) + "…" : name}
				</option>
			))}
		</>
	);

	// TextBox 입력 가능 여부
	const isTextBoxEditable = useMemo(() => {
		if (togetherInfo?.user.IsCheckedIn && selectedPostVisibility !== "NOTICE") {
			return false;
		}
		return true;
	}, [togetherInfo, selectedPostVisibility]);

	// 함께하기 item: api로 불러올수도있으니 useMemo 사용
	const togetherItem = useMemo(
		() =>
			togetherInfo ? (
				<TogetherListItem
					id={togetherInfo.together.id}
					image={togetherInfo.together.image}
					name={togetherInfo.together.name}
					category={togetherInfo.together.category}
					isOnline={togetherInfo.together.isOnline}
					href={togetherInfo.together.href}
					widthClass="w-full"
				/>
			) : (
				""
			),
		[togetherInfo],
	);

	// 게시 버튼 disable 조건
	const disableSubmitButton = useMemo(() => {
		// 1) 이미 인증한 함께하기일 경우
		if (togetherInfo?.user.IsCheckedIn) {
			const isLeader = togetherInfo.user.role === "leader";
			const isNotice = selectedPostVisibility === "NOTICE";
			// 리더이면서 notice만 가능
			if (isLeader && isNotice) return false;

			// 그 외는 전부 불가능
			return true;
		}
		// 2) 공개 여부가 선택되지 않으면 불가능
		if (!selectedPostVisibility) return true;

		// 3) 이미지 또는 텍스트 중 하나라도 있으면 가능
		const hasContent = feedImages.length > 0 || !!textBoxValue;
		if (!hasContent) return true;

		// 4) 그 외는 가능
		return false;
	}, [selectedPostVisibility, togetherInfo, feedImages, textBoxValue]);

	return (
		<div
			className="flex w-full h-[90vh] max-w-4xl max-h-4xl bg-white box-border"
			onClick={(e) => e.stopPropagation()}
		>
			{/* ---------이미지영역 */}
			<div className="w-3/5 h-full flex flex-col bg-black/30">
				<FeedImageInput value={feedImages} setValue={setFeedImages} />
			</div>
			{/* --------콘텐츠영역 */}
			<div className="flex flex-col w-2/5 h-full px-3">
				{/* 함께하기 선택 */}
				<div className="py-4 flex justify-start items-end  border-b border-b-pastelblue gap-2">
					<select
						name="together"
						id="together"
						value={selectedTogether}
						onChange={handleTogetherSelectionChange}
						className="outline-none"
					>
						{selectTogetherOption}
					</select>
					{initialTogetherInfo ? (
						""
					) : (
						<label htmlFor="together" className={`text-sm	text-gray-400`}>
							*인증 할 함께하기를 선택해주세요.
						</label>
					)}
				</div>
				{/* 스크롤zone */}
				<div className="flex flex-col flex-1 overflow-y-auto">
					{/* 텍스트박스 */}

					<TextBox
						ref={textBoxRef}
						isAble={isTextBoxEditable}
						hidden={!isTextBoxEditable}
						className={`flex-1 min-h-fit px-2 mt-3 overflow-visible`}
						placeholder={
							selectedPostVisibility === "NOTICE"
								? "공지글을 입력해주세요."
								: "글을 입력해주세요."
						}
						setValue={setTextBoxValue}
					/>
					{!isTextBoxEditable && (
						<div className="flex-1 px-2 mt-3 text-mainred">
							이미 인증을 완료한 함께하기 입니다.
						</div>
					)}
					{/* 함께하기 바로가기 */}
					{togetherInfo ? (
						<div className="p-2" onClick={handleTogetherItemClick}>
							{togetherItem}
						</div>
					) : (
						""
					)}
					{/* 태그 입력 */}
					<TagInput onTagChanged={setTagsValue} />
				</div>
				{/* 공개/비공개 선택 */}
				<PostVisibilityOptions
					togetherInfo={togetherInfo}
					value={selectedPostVisibility}
					setValue={setSelectedPostVisibility}
				/>

				<Button
					className="w-full my-3"
					disabled={disableSubmitButton || isPending}
					onClick={handleFeedFormSubmit}
				>
					게시하기
				</Button>
			</div>
		</div>
	);
}
export default FeedCreatorModal;

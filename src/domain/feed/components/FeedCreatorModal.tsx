"use client";
import FeedImageInput from "./FeedImageInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextBox, { TextBoxHandle } from "../../../shared/components/TextBox";
import Button from "../../../shared/components/Button";
import TagInput from "../../../shared/components/TagInput";
import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { FeedCreateRequest } from "../types";
import { ImageUploadResponse } from "@/shared/types/types";
import Swal from "sweetalert2";
import { usePostFeed } from "../api/usePostFeed";
import { useAuthStore } from "@/store/authStore";
import PostVisibilityOptions from "./PostVisibilityOptions";
import { useModalStore } from "../../modal/store/useModalStore";
import { MyTogetherInfo } from "@/domain/together/types";
import { useGetOwnTogetherList } from "@/domain/together/api/useGetOwnTogetherList";
import { useParams, usePathname } from "next/navigation";
import { useGetTogetherById } from "@/domain/together/api/useGetTogetherById";
import { categoryType, isOnlineType } from "@/shared/constants/filter";
import { Alert, ConfirmAlert, UpdateAlert } from "@/shared/utils/alert";

function FeedCreatorModal({ onClose }: { onClose: () => void }) {
	const pathname = usePathname();
	const isTogetherRoute = pathname.startsWith("/together");
	const { id: togetherId } = useParams<{ id: string }>();

	const { data: initialTogetherInfo, isLoading } = useGetTogetherById(
		togetherId,
		{
			enabled: isTogetherRoute && !!togetherId,
		},
	);

	const [feedImages, setFeedImages] = useState<ImageUploadResponse[]>([]);
	const [selectedTogetherId, setSelectedTogetherId] = useState<
		number | undefined
	>();
	const [textBoxValue, setTextBoxValue] = useState<string>();
	const [tagsValue, setTagsValue] = useState<string[]>();
	const [togetherInfo, setTogetherInfo] = useState<
		MyTogetherInfo | undefined
	>();
	const textBoxRef = useRef<TextBoxHandle>(null);
	const [selectedPostVisibility, setSelectedPostVisibility] = useState<
		FeedCreateRequest["visibility"] | null
	>("PUBLIC");

	const { me } = useAuthStore();
	const userId = me?.memberId;
	const { data: ownTogetherList } = useGetOwnTogetherList(userId!);
	const setCanClose = useModalStore((s) => s.setCanClose);
	const resetCanClose = useModalStore((s) => s.resetCanClose);

	const userTogetherList = useMemo(() => {
		if (pathname === "/") {
			return ownTogetherList?.data;
		}
	}, [ownTogetherList?.data, pathname]);

	useEffect(() => {
		if (!isTogetherRoute) return;
		if (!initialTogetherInfo?.data) return;

		const detailInfo: MyTogetherInfo = {
			id: initialTogetherInfo.data.id,
			title: initialTogetherInfo.data.title,
			category: initialTogetherInfo.data.category,
			mode: initialTogetherInfo.data.mode,
			capacity: initialTogetherInfo.data.capacity,
			startDate: initialTogetherInfo.data.startDate,
			endDate: initialTogetherInfo.data.endDate,
			memberId: initialTogetherInfo.data.memberId,
			participants: initialTogetherInfo.data.participants,
			progress: initialTogetherInfo.data.progress,
			thumbnailImage:
				initialTogetherInfo.data.thumbnailImage?.[0]?.imageUrl ?? null,
			goal: initialTogetherInfo.data.goal ?? 0,
		};

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedTogetherId(detailInfo.id);
		setTogetherInfo(detailInfo);
	}, [initialTogetherInfo?.data, isTogetherRoute]);

	const {
		mutate: postFeed,
		isPending,
		isSuccess,
	} = usePostFeed({
		onMutate: () => {
			Alert({
				title: "업로드 중입니다.",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});
		},
		onSuccess: () => {
			Swal.hideLoading();
			UpdateAlert({
				title: "업로드 성공",
			});
			setTimeout(() => {
				Swal.close();
				textBoxRef.current?.clear();
				setFeedImages([]);
				setTextBoxValue("");
				onClose();
			}, 1500);
		},
		onError: (error) => {
			Swal.hideLoading();
			UpdateAlert({
				title: "업로드 실패",
				text: error.response?.data.message,
			});
			setTimeout(() => {
				Swal.close();
			}, 1500);
		},
	});

	useEffect(() => {
		setCanClose("feedCreate", async () => {
			if (isSuccess) {
				return true;
			}

			if (
				feedImages.length === 0 &&
				(!textBoxValue || textBoxValue.trim() === "")
			) {
				return true;
			}

			const result = await ConfirmAlert({
				title: "게시물을 삭제하시겠어요?",
				text: "지금 나가면 수정 내용이 저장되지 않습니다.",
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: "삭제",
				cancelButtonText: "취소",
				red: true,
			});

			return result.isConfirmed;
		});

		return () => {
			resetCanClose("feedCreate");
		};
	}, [feedImages.length, isSuccess, resetCanClose, setCanClose, textBoxValue]);

	const handleFeedFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedPostVisibility) return;
		const feedType = (() => {
			if (selectedTogetherId) {
				if (selectedPostVisibility === "NOTICE") {
					return "TOGETHER_NOTICE";
				}
				return "TOGETHER_VERIFICATION";
			}
			return "GENERAL";
		})();

		const feedFormData: FeedCreateRequest = {
			feedType,
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
			togetherId: selectedTogetherId,
		};
		postFeed(feedFormData);
	};

	const handleTogetherSelectionChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = e.target.value;
		setSelectedTogetherId(Number(value));
		const selected = userTogetherList?.find((i) => i.id.toString() === value);
		setTogetherInfo(selected ?? undefined);

		let checkedPostVisibility = document.querySelector(
			'input[name="postVisibility"]:checked',
		);
		if (!checkedPostVisibility) setSelectedPostVisibility(null);
		checkedPostVisibility = null;
	};

	const handleTogetherItemClick = useCallback(() => {
		window.open(
			`/together/${togetherInfo?.id}`,
			"_blank",
			"noopener,noreferrer",
		);
	}, [togetherInfo?.id]);

	// 함께하기 선택 옵션
	const selectTogetherOption = useMemo(() => {
		if (isTogetherRoute) {
			if (!initialTogetherInfo?.data) {
				return (
					<option disabled>
						{isLoading ? "불러오는 중..." : "데이터 없음"}
					</option>
				);
			}

			return (
				<option>
					{initialTogetherInfo.data.title.length > 7
						? initialTogetherInfo.data.title.slice(0, 7) + "…"
						: initialTogetherInfo.data.title}
				</option>
			);
		} else {
			return (
				<>
					<option value="main" defaultValue={undefined}>
						개인 피드
					</option>
					{userTogetherList?.map(({ id, title }) => (
						<option key={id} value={id}>
							{title.length > 7 ? title.slice(0, 7) + "…" : title}
						</option>
					))}
				</>
			);
		}
	}, [initialTogetherInfo, isLoading, isTogetherRoute, userTogetherList]);

	// TextBox 입력 가능 여부
	const isTextBoxEditable = useMemo(() => {
		// if (
		// 	togetherInfo?.user.IsCheckedIn &&
		// 	selectedPostVisibility !== "NOTICE"
		// ) {
		// 	return false;
		// }
		return true;
	}, [togetherInfo, selectedPostVisibility]);

	// 함께하기 item: api로 불러올수도있으니 useMemo 사용
	const togetherItem = useMemo(() => {
		if (isTogetherRoute) {
			if (!initialTogetherInfo?.data) {
				return;
			} else {
				return (
					<TogetherListItem
						id={initialTogetherInfo.data.id}
						//initialTogetherInfo.data.thumbnailImage[0].imageUrl ??
						image={"/defaultFeedImage.png"}
						name={initialTogetherInfo.data.title}
						category={categoryType[initialTogetherInfo.data.category]}
						isOnline={isOnlineType[initialTogetherInfo.data.mode]}
						onClick={handleTogetherItemClick}
						widthClass="w-full"
					/>
				);
			}
		} else {
			if (togetherInfo) {
				return (
					<TogetherListItem
						id={togetherInfo.id}
						image={togetherInfo.thumbnailImage ?? "/defaultFeedImage.png"}
						name={togetherInfo.title}
						category={categoryType[togetherInfo.category]}
						isOnline={isOnlineType[togetherInfo.mode]}
						onClick={handleTogetherItemClick}
						widthClass="w-full"
					/>
				);
			}
		}
	}, [
		handleTogetherItemClick,
		initialTogetherInfo,
		isTogetherRoute,
		togetherInfo,
	]);

	// 게시 버튼 disable 조건
	const disableSubmitButton = useMemo(() => {
		const myRole = togetherInfo?.participants?.find(
			(p) => p.memberId === userId,
		)?.participantRole;
		// 1) 이미 인증한 함께하기일 경우
		// if (togetherInfo?.user.IsCheckedIn) {
		// 	const isLeader = myRole === "LEADER";
		// 	const isNotice = selectedPostVisibility === "NOTICE";
		// 	// 리더이면서 notice만 가능
		// 	if (isLeader && isNotice) return false;

		// 	// 그 외는 전부 불가능
		// 	return true;
		// }
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
						value={selectedTogetherId}
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
					{togetherInfo || initialTogetherInfo ? (
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
					userId={userId}
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

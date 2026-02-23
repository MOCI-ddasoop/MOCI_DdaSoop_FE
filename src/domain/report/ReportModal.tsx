"use client";

import Button from "@/shared/components/Button";
import { useEffect, useState } from "react";
import { useModalStore } from "../modal/store/useModalStore";
import Swal from "sweetalert2";
import reportModalStore from "./stores/useReportModalStore";
import { ReportCreateRequest } from "./type";
import { usePostReport } from "./api/usePostReport";

function ReportModal({ onClose }: { onClose: () => void }) {
	const targetType = reportModalStore((s) => s.reportTargetType);
	const targetId = reportModalStore((s) => s.reportTargetId);
	const action = reportModalStore((s) => s.action);
	const [checkedReasonType, setCheckedReasonType] = useState<
		ReportCreateRequest["reasonType"] | null
	>(null);
	const [reasonDetail, setReasonDetail] = useState<string | undefined>(
		undefined,
	);

	//close store
	const setCanClose = useModalStore((store) => store.setCanClose);
	const resetCanClose = useModalStore((store) => store.resetCanClose);

	const {
		mutate: postReport,
		isPending,
		isSuccess,
	} = usePostReport({
		onMutate: () => {
			Swal.fire({
				title: "신고 중입니다.",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});
		},
		onSuccess: () => {
			Swal.hideLoading();
			Swal.update({
				title: "신고 완료",
				icon: "success",
			});
			setTimeout(() => {
				Swal.close();
				setCheckedReasonType(null);
				setReasonDetail(undefined);
				action.resetReportTarget();
				onClose();
			}, 1500);
		},
		onError: (error) => {
			Swal.hideLoading();
			Swal.update({
				title: "신고 실패",
				text: error.response?.data.message,
				icon: "error",
			});
			setTimeout(() => {
				Swal.close();
			}, 1500);
		},
	});

	const handleSubmit = () => {
		if (!targetType || !targetId || !checkedReasonType) return;
		postReport({
			targetType,
			targetId,
			reasonType: checkedReasonType,
			reasonDetail,
		});
	};

	const REPORT_REASONS: {
		value: ReportCreateRequest["reasonType"];
		label: string;
	}[] = [
		{ value: "SPAM", label: "스팸 / 홍보성 도배" },
		{ value: "HATE_SPEECH", label: "증오심 표현 / 차별" },
		{ value: "HARASSMENT", label: "괴롭힘 / 모욕" },
		{ value: "INAPPROPRIATE_CONTENT", label: "부적절한 콘텐츠" },
		{ value: "VIOLENCE", label: "폭력 또는 위험한 행위" },
		{ value: "FALSE_INFORMATION", label: "허위 정보 / 유언비어" },
		{ value: "COPYRIGHT", label: "저작권 침해" },
		{ value: "PRIVACY", label: "개인정보 노출" },
		{ value: "OTHER", label: "기타 사유" },
	];

	useEffect(() => {
		setCanClose("report", async () => {
			if (isSuccess) {
				return true;
			}
			if (!reasonDetail || reasonDetail.trim() === "") {
				return true;
			}
			const result = await Swal.fire({
				icon: "error",
				titleText: "작성중인 내용이 있어요",
				text: "지금 나가면 작성중인 내용이 저장되지 않습니다.",
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: "창 닫기",
				cancelButtonText: "취소",
			});
			return result.isConfirmed;
		});

		return () => {
			resetCanClose("report");
		};
	}, [resetCanClose, setCanClose, reasonDetail, isSuccess]);

	return (
		<div>
			<div
				className="absolute flex flex-col gap-4 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-2 w-1/4 min-w-sm z-50"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-center text-2xl font-semibold text-slate-700">
					{targetType === "FEED" ? "이 게시글을 신고하는 이유" : ""}
					{targetType === "COMMENT" ? "이 댓글을 신고하는 이유" : ""}
				</h2>
				<form action="submit" onSubmit={handleSubmit}>
					<fieldset className="p-2">
						<legend className="font-semibold text-slate-700">신고사유</legend>
						<div className="flex flex-col gap-2">
							{REPORT_REASONS.map((reason) => (
								<label key={reason.value}>
									<input
										type="radio"
										name="reportReason"
										value={reason.value}
										checked={checkedReasonType === reason.value}
										onChange={(e) =>
											setCheckedReasonType(
												e.target.value as ReportCreateRequest["reasonType"],
											)
										}
									/>
									<span className="reason-label ml-1">{reason.label}</span>
								</label>
							))}
						</div>
						{checkedReasonType === "OTHER" ? (
							<textarea
								rows={4}
								className="w-full resize-none p-2 outline outline-gray-200 rounded-md"
								value={reasonDetail}
								onChange={(e) => setReasonDetail(e.target.value)}
							/>
						) : (
							""
						)}
					</fieldset>
					<Button
						color="red"
						className="w-full"
						disabled={isPending}
						onClick={handleSubmit}
					>
						신고하기
					</Button>
				</form>
			</div>
		</div>
	);
}
export default ReportModal;

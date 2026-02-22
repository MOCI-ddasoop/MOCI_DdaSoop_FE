"use client";

import Button from "@/shared/components/Button";
import { useEffect, useId, useState } from "react";
import { useModalStore } from "../modal/store/useModalStore";
import Swal from "sweetalert2";

function ReportModal() {
	const textareaId = useId();

	const [text, setText] = useState("");

	// 여기서 캐싱된 데이터를 리로드하거나 데이터를 store로 넘겨받아 렌더링.

	//close store
	const setCanClose = useModalStore((store) => store.setCanClose);
	const resetCanClose = useModalStore((store) => store.resetCanClose);

	useEffect(() => {
		setCanClose("report", async () => {
			if (!text || text.trim() === "") {
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
	}, [resetCanClose, setCanClose, text]);

	return (
		<div>
			<div
				className="absolute flex flex-col gap-4 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-2 w-1/4 min-w-sm z-50"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-center text-2xl font-semibold text-slate-700">
					신고하기
				</h2>
				<div>
					<div className="font-semibold text-slate-700">신고할 게시물</div>
					<div>store를 통한 feedId 또는 commentId 조회 후 출력</div>
				</div>
				<form action="">
					<label htmlFor={textareaId} className="font-semibold text-slate-700">
						신고사유
					</label>
					<textarea
						rows={5}
						className="w-full resize-none p-2 outline outline-gray-200 rounded-md"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button color="red" className="w-full">
						신고하기
					</Button>
				</form>
			</div>
		</div>
	);
}
export default ReportModal;

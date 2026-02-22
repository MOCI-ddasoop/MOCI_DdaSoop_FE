"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "./store/useModalStore";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FeedModal from "../feed/components/FeedModal";
import FeedCreatorModal from "../feed/components/FeedCreatorModal";
import ReportModal from "../report/ReportModal";

function ModalRoot() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathName = usePathname();

	const modalStack = useModalStore((store) => store.stack);
	const openStoreModal = useModalStore((store) => store.open);
	const closeStoreModal = useModalStore((store) => store.close);

	const [mounted, setMounted] = useState(false);

	const feedId = searchParams.get("feedId");

	useEffect(() => {
		if (feedId) {
			openStoreModal("feed");
		}
	}, [feedId, openStoreModal]);

	const topModal = modalStack[modalStack.length - 1];

	const handleClose = useCallback(async () => {
		if (!topModal) return;

		const hasClosed = await closeStoreModal();

		if (hasClosed) {
			if (topModal === "feed") {
				const params = new URLSearchParams(searchParams.toString());
				params.delete("feedId");
				router.push(`${pathName}?${params.toString()}`, { scroll: false });
			}
		}
	}, [closeStoreModal, pathName, router, searchParams, topModal]);

	//브라우저가 마운트 될때까지 기대림 createPortal 때문
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!feedId && modalStack.length === 0) return;

		// ESC 키로 닫기
		const handleEscape = async (e: KeyboardEvent) => {
			if (e.isComposing) return;
			if (e.key !== "Escape") return;
			await handleClose();
		};
		document.addEventListener("keydown", handleEscape);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [feedId, handleClose, modalStack.length]);

	if (!mounted) return null;
	if (!feedId && modalStack.length === 0) return null;

	return createPortal(
		<>
			{modalStack.map((type) => {
				if (type === "feed" && !feedId) return;

				return (
					<div
						key={type}
						className={`fixed top-0 left-0 w-full h-full z-50 flex-center ${
							type === topModal ? "pointer-events-auto" : "pointer-events-none"
						}`}
					>
						<div
							className={`fixed top-0 left-0 w-full h-full flex-center bg-black/50 z-50 backdrop-blur-sm`}
							onClick={handleClose}
						>
							{/* 콘텐츠 영역: 각 타입에 맞는 모달 렌더링 */}
							{type === "feed" && feedId && <FeedModal feedId={feedId} />}
							{type === "feedCreate" && (
								<FeedCreatorModal onClose={handleClose} />
							)}
							{type === "report" && <ReportModal />}
						</div>
					</div>
				);
			})}
		</>,
		document.body,
	);
}
export default ModalRoot;

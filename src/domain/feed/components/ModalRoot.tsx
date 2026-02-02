"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "../store/useModalStore";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FeedModal from "./FeedModal";
import FeedCreatorModal, { CreateFeedModalRef } from "./FeedCreatorModal";

function ModalRoot() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathName = usePathname();

	const modalType = useModalStore((store) => store.type);
	const closeStoreModal = useModalStore((store) => store.close);

	const [mounted, setMounted] = useState(false);

	const feedId = searchParams.get("feedId");
	const isOpen = Boolean(feedId) || modalType !== null;

	const createFeedModalRef = useRef<CreateFeedModalRef>(null);

	const handleClose = async (reason?: "confirm") => {
		if (feedId) {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("feedId");
			router.push(`${pathName}?${params.toString()}`, { scroll: false });
			return;
		}
		if (modalType === "feedCreate") {
			if (reason === "confirm") {
				const canClose = await createFeedModalRef.current?.canClose();
				if (!canClose) return;
			}
		}

		closeStoreModal();
	};

	//브라우저가 마운트 될때까지 기대림 createPortal 때문
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		// ESC 키로 닫기
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose("confirm");
		};
		document.addEventListener("keydown", handleEscape);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!mounted) return null;
	if (!feedId && !modalType) return null;

	return createPortal(
		// Overlay
		<div
			className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
			onClick={() => handleClose("confirm")}
		>
			{feedId && <FeedModal feedId={feedId} />}
			{modalType === "feedCreate" && (
				<FeedCreatorModal ref={createFeedModalRef} onClose={handleClose} />
			)}
		</div>,
		document.body,
	);
}
export default ModalRoot;

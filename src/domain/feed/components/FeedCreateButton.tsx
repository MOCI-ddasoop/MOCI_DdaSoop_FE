"use client";
import Button from "../../../shared/components/Button";
import { RiQuillPenLine } from "react-icons/ri";
import tw from "@/shared/utils/tw";
import { useModalStore } from "../store/store";

function FeedCreateButton({ className }: { className?: string }) {
	const openStoreModal = useModalStore((store) => store.open);

	return (
		<Button
			className={tw("w-xs flex-center gap-3", className)}
			onClick={() => openStoreModal("feedCreate")}
		>
			<RiQuillPenLine size={"1.5rem"} />
			<span>피드 업로드</span>
		</Button>
	);
}
export default FeedCreateButton;

"use client";
import Button from "../../../shared/components/Button";
import { RiQuillPenLine } from "react-icons/ri";
import tw from "@/shared/utils/tw";
import { useModalStore } from "../../modal/store/useModalStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { GoArrowRight } from "react-icons/go";

function FeedCreateButton({ className }: { className?: string }) {
	const router = useRouter();
	const openStoreModal = useModalStore((store) => store.open);
	const userId = useAuthStore((s) => s.me?.memberId);

	const handleClick = () => {
		if (!userId) {
			router.push("/login");
			return;
		}
		openStoreModal("feedCreate");
	};

	return (
		<Button
			className={tw("w-xs flex-center gap-3", className)}
			onClick={handleClick}
		>
			{userId ? (
				<>
					<RiQuillPenLine size={"1.5rem"} />
					<span>피드 업로드</span>
				</>
			) : (
				<>
					<span>로그인 바로가기</span>
					<GoArrowRight size={"1.5rem"} />
				</>
			)}
		</Button>
	);
}
export default FeedCreateButton;

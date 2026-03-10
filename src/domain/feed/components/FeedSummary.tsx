import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useGetFeedById } from "../api/useGetFeedById";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";

interface FeedSummaryProps {
	id: number;
	className?: string;
	onClick?: () => void;
	isDeleted?: boolean;
}

function FeedSummary({ id, className, onClick, isDeleted}: FeedSummaryProps) {
	const { data: feed, isLoading } = useGetFeedById(id, !isDeleted);

	if(isDeleted){
		return (
			<div
				className={tw("flex items-center gap-2 bg-gray-100 px-3 py-4 text-sm text-gray-400", className)}
			>
				삭제된 피드입니다
			</div>
		)
	}

	if (isLoading)
		return (
			<div className="flex-1 animate-pulse min-h-[50px] bg-gray-100 rounded" />
		);

	return (
		<div
			className={tw("flex items-center gap-2 bg-gray-100 px-2 py-1", className)}
			onClick={onClick}
		>
			<div className="flex flex-col gap-1 flex-1">
				<div className="flex items-center gap-2">
					<div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300 shrink-0">
						{feed?.authorProfileImage && (
							<Image
								src={feed.authorProfileImage}
								alt={feed.authorNickname ?? "사용자를 찾을 수 없음"}
								fill
								className="object-cover"
								referrerPolicy="no-referrer"
							/>
						)}
					</div>
					<div className="p-1 break-all line-clamp-2">
						<span className="font-bold inline">{feed?.authorNickname}</span>{" "}
						<span 
							className="text-gray-500 inline break-all"
							dangerouslySetInnerHTML={{
								__html: sanitizeHtml(feed?.content ?? "")
							}}
							/>
					</div>
				</div>
				<div className="text-xs text-gray-500">{feed?.createdAt}</div>
			</div>

			{feed?.images && feed.images.length > 0 && (
				<div className="relative h-15 w-15 rounded-md overflow-hidden border border-gray-300 shrink-0">
					<Image
						src={feed.images[0].imageUrl ?? "/defaultFeedImage.png"}
						alt={feed.authorNickname || "feed image"}
						fill
						className="object-cover"
						referrerPolicy="no-referrer"
					/>
				</div>
			)}
		</div>
	);
}
export default FeedSummary;

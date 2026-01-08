import tw from "@/shared/utils/tw";
import Image from "next/image";
import { useGetFeedById } from "../api/useGetFeedById";

interface FeedSummaryProps {
	id: number;
	className?: string;
}

function FeedSummary({ id, className }: FeedSummaryProps) {
	const { data: feed, isLoading } = useGetFeedById(id);

	if (isLoading)
		return (
			<div className="flex-1 animate-pulse min-h-[50px] bg-gray-100 rounded" />
		);

	return (
		<div
			className={tw("flex items-center gap-2 bg-gray-100 px-2 py-1", className)}
		>
			<div className="flex flex-col gap-1 flex-1">
				<div className="flex items-center gap-2">
					<div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300 shrink-0">
						{feed?.authorProfileImage && (
							<Image
								src={feed.authorProfileImage}
								alt={feed.authorName}
								fill
								className="object-cover"
							/>
						)}
					</div>
					<div className="p-1 break-all line-clamp-2">
						<span className="font-bold inline">{feed?.authorName}</span>
						<span className="text-gray-500 inline break-all">
							{" "}
							{feed?.content}
						</span>
					</div>
				</div>
				<div className="text-xs text-gray-500">{feed?.createdAt}</div>
			</div>

			{feed?.images && feed.images.length > 0 && (
				<div className="relative h-15 w-15 rounded-md overflow-hidden border border-gray-300 shrink-0">
					<Image
						src={feed.images[0].imageUrl}
						alt={feed.authorName || "feed image"}
						fill
						className="object-cover"
					/>
				</div>
			)}
		</div>
	);
}
export default FeedSummary;

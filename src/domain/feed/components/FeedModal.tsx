import { useMemo } from "react";
import FeedViewer from "./FeedViewer";
import { FeedEditStoreProvider } from "../provider/FeedEditStoreProvider";
import { createFeedEditStore } from "../store/feedEditStore";
import { useGetFeedById } from "../api/useGetFeedById";
import { CommentScrollProvider } from "@/domain/comment/provider/CommentScrollProvider";
import { createCommentScrollStore } from "@/domain/comment/store/commentScrollStore";

function FeedModal({ feedId }: { feedId: string }) {
	const { data: feedDetailData } = useGetFeedById(feedId);

	const feedEditStore = useMemo(() => {
		if (!feedDetailData) return;
		return createFeedEditStore(feedDetailData);
	}, [feedDetailData]);

	const commentScrollStore = useMemo(() => {
		return createCommentScrollStore();
	}, []);

	return (
		<div
			className="flex w-full h-[90vh] max-w-4xl bg-white"
			onClick={(e) => e.stopPropagation()}
		>
			<FeedEditStoreProvider store={feedEditStore}>
				<CommentScrollProvider store={commentScrollStore}>
					<FeedViewer feed={feedDetailData} />
				</CommentScrollProvider>
			</FeedEditStoreProvider>
		</div>
	);
}

export default FeedModal;

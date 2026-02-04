import { useMemo } from "react";
import FeedEditStoreProvider from "../provider/FeedEditStoreProvider";
import FeedViewer from "./FeedViewer";
import { createFeedEditStore } from "../store/feedEditStore";
import { useGetFeedById } from "../api/useGetFeedById";

function FeedModal({ feedId }: { feedId: string }) {
	const { data: feedDetailData } = useGetFeedById(feedId);

	const store = useMemo(() => {
		if (!feedDetailData) return;
		return createFeedEditStore(feedDetailData);
	}, [feedDetailData]);

	return (
		<div
			className="flex w-full h-[90vh] max-w-4xl bg-white"
			onClick={(e) => e.stopPropagation()}
		>
			<FeedEditStoreProvider store={store}>
				<FeedViewer feed={feedDetailData} />
			</FeedEditStoreProvider>
		</div>
	);
}

export default FeedModal;

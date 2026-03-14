"use client";
import { useMemo } from "react";
import FeedViewer from "./FeedViewer";
import { FeedEditStoreProvider } from "../provider/FeedEditStoreProvider";
import { createFeedEditStore } from "../store/feedEditStore";
import { useGetFeedById } from "../api/useGetFeedById";
import { CommentScrollProvider } from "@/domain/comment/provider/CommentScrollProvider";
import { createCommentScrollStore } from "@/domain/comment/store/commentScrollStore";
import { SubmitRegistryProvider } from "../provider/SubmitRegistryProvider";
import axios from "axios";
import { ApiErrorResponse } from "../types";

function FeedModal({ feedId }: { feedId: string }) {
	const {
		data: feedDetailData,
		isLoading,
		isError,
		error,
	} = useGetFeedById(feedId);

	const feedEditStore = useMemo(() => {
		if (!feedDetailData) return;
		return createFeedEditStore(feedDetailData);
	}, [feedDetailData]);

	const commentScrollStore = useMemo(() => {
		return createCommentScrollStore();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-[90vh] max-w-4xl bg-white">
				<div className="loader"></div>
			</div>
		);
	}

	// 🔹 에러 상태 (서버 message 노출)
	if (isError) {
		let errorMessage = "알 수 없는 오류가 발생했습니다.";

		if (axios.isAxiosError<ApiErrorResponse>(error)) {
			errorMessage = error.response?.data?.message ?? errorMessage;
		}

		return (
			<div className="flex flex-col items-center w-full h-[90vh] max-w-4xl bg-white gap-3">
				<h2 className="text-gray-400 mt-12">{errorMessage}</h2>
			</div>
		);
	}

	return (
		<div
			className="flex w-full h-[90vh] max-w-4xl bg-white"
			onClick={(e) => e.stopPropagation()}
		>
			<FeedEditStoreProvider store={feedEditStore}>
				<CommentScrollProvider store={commentScrollStore}>
					<SubmitRegistryProvider>
						<FeedViewer feed={feedDetailData} />
					</SubmitRegistryProvider>
				</CommentScrollProvider>
			</FeedEditStoreProvider>
		</div>
	);
}

export default FeedModal;

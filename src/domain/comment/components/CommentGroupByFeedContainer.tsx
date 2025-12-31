"use client";

import { groupById } from "@/shared/utils/groupById";
import CommentItem from "./CommentItem";
import { useState } from "react";
import FeedSummary from "@/domain/feed/components/FeedSummary";

const FEED_DATA = Array.from({ length: 20 }).map((_, index) => ({
	id: index,
	title: "Feed 1",
	author: "author 1",
	content: "Feed 1 contentdsadsadsadsadsadsadsadasdasdas",
	category: "category 1",
	date: "2025년 1월 1일",
	likeCount: 10,
	commentCount: 10,
	tags: ["tag1", "tag2", "tag3"],
	likedByMe: false,
	image:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
}));

const COMMENT_LIST = Array.from({ length: 10 }).map((_, index) => ({
	feedId: index,
	id: index,
	profileImage:
		"https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
	author: "John Doe",
	date: "2025년 1월 1일",
	content: "Hello, world!",
}));

function FeedGroupCommentContiner() {
	const [commentList, setCommentList] = useState(() =>
		groupById([...COMMENT_LIST, ...COMMENT_LIST], "feedId")
	);

	return (
		<ul className="flex flex-col gap-2 w-full">
			{COMMENT_LIST.map((comment) => {
				const feed = FEED_DATA.find((feed) => feed.id === comment.feedId);
				return (
					<div
						className="flex gap-4 w-full border-b border-gray-100"
						key={comment.id}
					>
						<FeedSummary
							id={feed?.id ?? 0}
							content={feed?.content ?? ""}
							author={feed?.author ?? ""}
							createdAt={feed?.date ?? ""}
							profileImage={feed?.image ?? ""}
							FeedImage={feed?.image ?? ""}
							className="h-fit"
						/>
						<div className="flex flex-col gap-2 w-fit flex-1">
							{commentList[comment.feedId].slice(0, 2).map((comment) => (
								<CommentItem
									key={comment.id}
									id={comment.id}
									profileImage={comment.profileImage}
									author={comment.author}
									date={comment.date}
									content={comment.content}
									className="w-full"
								/>
							))}
						</div>
					</div>
				);
			})}
		</ul>
	);
}
export default FeedGroupCommentContiner;

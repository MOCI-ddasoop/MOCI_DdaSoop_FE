export type FeedData = {
	feedType: "GENERAL";
	content: string;
	images: [
		{
			imageUrl: string;
			width: number;
			height: number;
			displayOrder: number;
			fileSize: number;
			originalFileName: string;
		}
	];
	tags: string[];
	visibility: "PUBLIC" | "PRIVATE";
	togetherId: number;
};

export interface FeedDetail {
	id: number;
	feedType: string;
	content: string;
	images: never[];
	tags: string[];
	visibility: string;
	reactionCount: number;
	commentCount: number;
	bookmarkCount: number;
	togetherId: null | string | number;
	isReacted: boolean;
	isBookmarked: boolean;
	createdAt: null | string;
	updatedAt: null | string;
}

export interface FeedContent {
	id: number;
	feedType: string;
	content: string;
	thumbnailUrl: string | null;
	thumbnailWidth: number | null;
	thumbnailHeight: number | null;
	imageCount: number;
	tags: string[];
	reactionCount: number;
	commentCount: number;
	bookmarkCount: number;
	authorId: number;
	authorName: string;
	authorNickname: string;
	authorProfileImage: string;
	togetherId: number | null;
	togetherTitle: string | null;
	createdAt: Date | null;
}

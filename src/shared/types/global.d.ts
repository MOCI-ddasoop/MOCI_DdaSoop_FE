type Together = {
	id: number;
	image: string;
	name: string;
	category: string;
	isOnline: string;
	href: string;
};

type Feed = {
	id: number;
	author: string;
	content: string;
	date: string;
	likeCount: number;
	commentCount: number;
	tags: string[];
	likedByMe: boolean;
	image: FeedImage[];
	togetherId?: number;
	postVisibility: string;
};

type Comment = {
	id: number;
	profileImage: string;
	author: string;
	date: string;
	content: string;
};

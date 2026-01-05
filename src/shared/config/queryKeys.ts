export const queryKeys = {
	feeds: {
		all: () => ["feeds"],
		id: (id: string) => ["feeds", id],
		list: (pageNum: number | string, params?: string[]) => [
			"feeds",
			"list",
			pageNum,
			params,
		],
		infinite: (page?: "together" | "member") =>
			page ? ["feeds", "infinite", page] : ["feed", "infinite"],
	},
	comments: {
		all: () => ["comments"],
		list: (feedId: string) => ["comments", feedId],
	},
};

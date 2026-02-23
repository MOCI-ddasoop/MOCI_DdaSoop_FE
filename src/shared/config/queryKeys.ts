export const queryKeys = {
	feeds: {
		all: () => ["feeds"],
		id: (id: string | number) => [
			"feeds",
			typeof id === "string" ? id : String(id),
		],
		list: (pageNum: number | string, params?: string[]) => [
			"feeds",
			"list",
			pageNum,
			params,
		],
		infinite: (params?: {
			page?: "together" | "member";
			togetherId?: number;
			memberId?: number;
		}) => {
			if (!params?.page) {
				return ["feeds", "infinite"];
			}

			if (params.page === "together") {
				return [
					"feeds",
					"infinite",
					{ page: "together", togetherId: params.togetherId },
				];
			}

			return [
				"feeds",
				"infinite",
				{ page: "member", memberId: params.memberId },
			];
		},
		togetherNotice: (id: number) => ["feeds", "notice", id],
		bookmark: () => ["feeds", "bookmark"],
		reaction: () => ["feeds", "reaction"],
		del: () => ["feeds", "delete"],
		udt: () => ["feeds", "update"],
	},
	comments: {
		all: () => ["comments"],
		id: (id: number) => ["comments", id],
		list: (feedId: string) => ["comments", feedId],
		react: () => ["comments", "react"],
		listByUser: (userId: string) => ["comments", "listByUser", userId],
		del: () => ["comments", "delete"],
		upt: () => ["comments", "update"],
	},

	donate: {
		all: () => ["donate"],
		id: (id: string) => ["donate", id],
		list: (memberId?: number) => {
			if (memberId) return ["donate", "list", memberId];
			else return ["donate", "list"];
		},
		history: (id: string) => ["donate", "history", id],
	},
	together: {
		all: () => ["together"],
		id: (id: string) => ["together", id],
		list: (params: {
			category?: string[];
			mode?: string;
			status?: string;
			sortType?: string;
			page?: number;
			size?: number;
		}) => ["together", "list", params],
		description: (id: string | number) => ["together", "description", id],
		member: (memberId: number) => ["together", "member", memberId],
		join: () => ["together", "join"],
		leave: () => ["together", "leave"],
		isParticipating: () => ["together", "participating"],
	},

	notifications: {
		list: (type?: string) =>
			type ? ["notifications", "list", type] : ["notifications", "list"],

		page: (type: string, pageNum: number | string, size?: number) => [
			"notifications",
			"list",
			type,
			pageNum,
			size,
		],
		recent: ["notifications", "recent"],
		read: () => ["notifications", "read"],
		delete: () => ["notifications", "delete"],
	},

	members: {
		me: () => ["members", "me"],
		counts: () => ["members", "counts"],
	},
	report: {
		create: () => ["report", "create"],
	},
};

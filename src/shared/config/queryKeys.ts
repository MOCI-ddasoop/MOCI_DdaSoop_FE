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
    notice: (id: number) => ["feeds", "notice", id],
  },
  comments: {
    all: () => ["comments"],
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
  },
  together: {
    all: () => ["together"],
    id: (id: string) => ["together", id],
    list: ({
      category,
      mode,
      status,
      sortType,
      page,
      size,
    }: {
      category?: string[];
      mode?: string;
      status?: string;
      sortType?: string;
      page?: number;
      size?: number;
    }) => ["together", "list", category, mode, status, sortType, page, size],
members:{
		me: () => ["members", "me"],
		counts: () => ["members", "counts"],
	}    description: (id: string | number) => ["together", "description", id],
    join: () => ["together", "join"],
    leave: () => ["together", "leave"],
  },

};

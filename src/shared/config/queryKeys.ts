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
    list: (memeberId?: number) => {
      if (memeberId) return ["together", "list", memeberId];
      else return ["together", "list"];
    },
  },
};

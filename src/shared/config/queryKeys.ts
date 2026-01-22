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
  members: {
    me: () => ["members", "me"],
    counts: () => ["members", "counts"],
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
};

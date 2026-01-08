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
  },
  comments: {
    all: () => ["commnets"],
    list: (feedId: string) => ["commnets", feedId],
    react: () => ["comments", "react"],
    listByUser: (userId: string) => ["comments", "listByUser", userId],
    del: () => ["comments", "delete"],
    upt: () => ["comments", "update"],
  },
};

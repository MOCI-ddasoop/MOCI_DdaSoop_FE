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
  },
  comments: {
    all: () => ["commnets"],
    list: (feedId: string) => ["commnets", feedId],
  },
  donate: {
    all: () => ["donate"],
    id: (id: string) => ["donate", id],
    list: () => ["donate", "list"],
  },
  together: {
    all: () => ["together"],
    id: (id: string) => ["together", id],
    list: () => ["together", "list"],
  },
};

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
};

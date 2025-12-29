// 쓸 건 아니고, 기존에 이렇게 사용했다는 참고용

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

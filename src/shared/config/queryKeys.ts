// 쓸 건 아니고, 기존에 이렇게 사용했다는 참고용

export const queryKeys = {
  feed: {
    all: () => ["feed"],
    id: (id: string) => ["feed", id],
    list: () => ["feed", "list"],
  },
};

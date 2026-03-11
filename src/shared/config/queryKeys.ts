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
      query?: string;
      page?: "together" | "member";
      togetherId?: number;
      memberId?: number;
    }) => {
      if (!params?.page) {
        return ["feeds", "infinite", params?.memberId];
      }

      if (params.page === "together") {
        return ["feeds", "infinite", "together", params.togetherId];
      }

      return ["feeds", "infinite", "member", params.memberId];
    },
    togetherNotice: (id: number) => ["feeds", "together", "notice", id],
    bookmark: () => ["feeds", "infinite", "bookmark"],
    search: (query?: string) => ["feeds", "infinite", "search", query],

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
    id: (id: string) => ["donate", id],
    list: (params: {
      category?: string[];
      status?: string;
      sortType?: string;
      page?: number;
      size?: number;
    }) => ["donate", "list", params],
    new: () => ["donate", "new"],
    history: (id: string) => ["donate", "history", id],
    newsCreate: (id: string) => ["donate", "news", "new", id],
    news: (id: string) => ["donate", "news", id],
    member: (memberId: number) => ["donate", "member", memberId],
    memberHistory: (memberId: number) => [
      "donate",
      "member",
      "history",
      memberId,
    ],
    summary: () => ["donate", "summary"],
    isCreator: ({ id, memberId }: { id: string; memberId: number }) => [
      "donate",
      "isCreator",
      { id, memberId },
    ],
  },
  together: {
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
    new: () => ["together", "new"],
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

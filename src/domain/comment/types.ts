export interface CommentType {
  id: number;
  commentType: string;
  content: string;
  authorId: number;
  authorName: string;
  authorNickname: string;
  authorProfileImage: string;
  targetId: number;
  parentId: null | number;
  replies: Replies[];
  replyCount: number;
  reactionCount: number;
  isReacted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  reply: boolean;
}

interface Replies {
  id: number;
  commentType: string;
  content: string;
  authorId: number;
  authorName: string;
  authorNickname: string;
  authorProfileImage: string;
  targetId: number;
  parentId: number;
  replies: null | Replies[];
  replyCount: null | number;
  reactionCount: number;
  isReacted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  reply: boolean;
}

export interface CommentPage {
  content: CommentType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

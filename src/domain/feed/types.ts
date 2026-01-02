export type FeedData = {
  feedType: "GENERAL";
  content: string;
  images: [
    {
      imageUrl: string;
      width: number;
      height: number;
      displayOrder: number;
      fileSize: number;
      originalFileName: string;
    }
  ];
  tags: string[];
  visibility: "PUBLIC" | "PRIVATE";
  togetherId: number;
};

export interface FeedDetail {
  id: number;
  feedType: string;
  content: string;
  authorName: string;
  authorProfileImage: string;
  images: {
    imageUrl: string;
    width: number;
    height: number;
    displayOrder: number;
    fileSize: number;
    originalFileName: string;
  }[];
  tags: string[];
  visibility: string;
  reactionCount: number;
  commentCount: number;
  bookmarkCount: number;
  togetherId: null | string | number;
  isReacted: boolean;
  isBookmarked: boolean;
  createdAt: null | string;
  updatedAt: null | string;
}

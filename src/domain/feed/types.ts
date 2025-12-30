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

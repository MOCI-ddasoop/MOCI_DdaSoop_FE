export const sortOptions = ["최신순", "인기순", "참여자순"];
export const categoryOptions = ["카테고리1", "카테고리2", "카테고리3"];
export const onlineOptions = ["온라인", "오프라인"];

export const notificationOptions = {
  FEED_REACTION: "피드좋아요",
  FEED_COMMENT: "댓글",
  FEED_COMMENT_REPLY: "대댓글",
  COMMENT_REACTION: "댓글좋아요",
  TOGETHER_INVITE: "함께하기초대",
  TOGETHER_JOIN: "함께하기참여",
  TOGETHER_START: "함께하기시작",
  TOGETHER_END: "함께하기종료",
  FOLLOW: "팔로우",
  SYSTEM: "시스템알림",
};

export const targetOptions: { [key: string]: string } = {
  FEED: "?feedId=",
  TOGETHER: "/together/",
  MEMBER: "/mypage", // 수정필요
};

export const sortOptions = ["최신순", "인기순", "마감순"];
export const categoryOptions = ["플로깅", "봉사활동", "친환경습관"];
export const onlineOptions = ["온라인", "오프라인"];

export const categoryType = {
  PLOGGING: "플로깅",
  CLEANUP: "봉사활동",
  RECYCLING: "친환경습관",
};

export const isOnlineType = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
};

export const sortType = {
  LATEST: "최신순",
  POPULAR: "인기순",
  DEADLINE: "마감순",
};

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

// TODO : path 변경하기
export const navItems = [
  { name: "메인피드", path: "/" },
  { name: "함께하기", path: "/together" },
  { name: "후원하기", path: "/donate" },
];

export const mypageTabContents = [
  { href: "/mypage/feeds", name: "내 피드" },
  { href: "/mypage/bookmarks", name: "북마크" },
  { href: "/mypage/replies", name: "댓글" },
  {
    href: "/mypage/together/join",
    name: "나의 함께하기",
    children: [
      { href: "/mypage/together/join", name: "참여한 함께하기" },
      { href: "/mypage/together/create", name: "개설한 함께하기" },
    ],
  },
  {
    href: "/mypage/donate/join",
    name: "나의 후원하기",
    children: [
      { href: "/mypage/donate/join", name: "참여한 후원" },
      { href: "/mypage/donate/create", name: "개설한 후원" },
    ],
  },
];

// TODO : path 변경하기(path에 모임id 포함되어야할듯)
export const togetherTabContents = (id: string) => [
  { href: `/together/${id}/info`, name: "모임 소개" },
  { href: `/together/${id}/feeds`, name: "인증피드" },
  { href: `/together/${id}/notice`, name: "공지" },
];

export const donateTabContents = (id: string) => [
  { href: `/donate/${id}/info`, name: "후원 소개" },
  { href: `/donate/${id}/history`, name: "기부 현황" },
  { href: `/donate/${id}/news`, name: "소식" },
];

export const notificationTabContents = [
  { href: "/notification/all", name: "전체" },
  { href: "/notification/like", name: "좋아요" },
  { href: "/notification/comment", name: "댓글" },
  { href: "/notification/together", name: "함께하기" },
  { href: "/notification/system", name: "시스템" },
];

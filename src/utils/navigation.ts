// TODO : path 변경하기
export const navItems = [
  { name: "메인피드", path: "/" },
  { name: "함께하기", path: "/together" },
  { name: "후원하기", path: "/donate" },
];

export const mypageTabContents = [
  { href: "/mypage/feeds", name: "내 피드" },
  { href: "/mypage/likes", name: "좋아요" },
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
export const togetherTabContents = [
  { href: "/together/info", name: "모임 소개" },
  { href: "/together/feeds", name: "인증피드" },
  { href: "/together/notice", name: "공지" },
];

export const donateTabContents = [
  { href: "/donate/info", name: "후원 소개" },
  { href: "/donate/history", name: "기부 현황" },
  { href: "/donate/news", name: "소식" },
];

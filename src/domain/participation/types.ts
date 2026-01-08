export type DetailInfoProps = {
  id: number;
  type: "together" | "donate";
  title: string;
  thumbnailImage: string;
  category: "PLOGGING" | "CLEANUP" | "RECYCLING" | "";
  dDay?: number; // 후원만
  participant?: number; // 참여자수(제한인원 있는 경우만 표시)
  capacity?: number; // 제한인원
  status?: string; // 모집중 모집완료(제한인원 있는 경우만 표시)
  startDate: string;
  endDate: string;
  mode?: "ONLINE" | "OFFLINE"; // 함께하기만
  goal: number;
  progress: number;
};

// 타입변경될 수 있음 유니온타입으로 바꿀 수 있는거 바꾸기
interface ParticipationCardProps {
  type: "together" | "donate";
  id: number;
  thumbnailImage: string;
  title: string;
  dDay: number; // 남은날짜
}

export interface TogetherCardProps extends ParticipationCardProps {
  type: "together";
  category: "PLOGGING" | "CLEANUP" | "RECYCLING";
  participants?: number; // 참여자수(제한인원 있는 경우만 표시)
  capacity?: number; // 제한인원(있는경우)
  status?: string; // 모집중 모집완료
  startDate: string;
  endDate: string;
  mode: "ONLINE" | "OFFLINE";
}

export interface DonateCardProps extends ParticipationCardProps {
  type: "donate";
  category: "PLOGGING" | "CLEANUP" | "RECYCLING";
  progress: number; // 진행률
}

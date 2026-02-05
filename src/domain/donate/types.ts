import { components } from "@/types/api/v1";

export type TogetherDto = components["schemas"]["TogetherDto"]; // unknown

export interface DonateInfo {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: number[] | null;
  thumbnailImage: string | null;
  progress: number | null;
  dDay: number;
}

export type DonateDetailInfo = {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING"; // 바꿔
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: number[] | null;
  progress: number | null;
  thumbnailImage: string[] | null;
  goal: number | null;
  dDay: number;
};

export interface DonateResponseData {
  content: DonateInfo[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { sorted: boolean; empty: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: { sorted: boolean; empty: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface DonateResponse {
  resultCode: string;
  msg: string;
  data: DonateResponseData;
}

export interface DonateDetailResponse {
  resultCode: string;
  msg: string;
  data: DonateDetailInfo;
}

export interface DonateDescriptionResponse {
  resultCode: string;
  msg: string;
  data: string;
}

export interface DonatePageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

// 카테고리, 온/오프라인, 모집중/모집완료 ->  타입지정해도 좋을듯
export type DonationListItemProps = {
  id: number;
  donationImage: string;
  name: string;
  amount: number;
  userName: string;
  href?: string;
};

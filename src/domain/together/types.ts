import { components } from "@/types/api/v1";

export type TogetherDto = components["schemas"]["TogetherDto"]; // unknown
export type CreateRequest = components["schemas"]["CreateRequest"];

export interface TogetherInfo {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING";
  mode: "ONLINE" | "OFFLINE";
  capacity?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: number | null;
  thumbnailImage: string | null;
  progress: number | null;
  dDay: number;
}

export type TogetherDetailInfo = {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING";
  mode: "ONLINE" | "OFFLINE";
  capacity?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: number | null;
  progress: number | null;
  thumbnailImage: { imageUrl: string }[] | null;
  goal: number | null;
};

export interface TogetherResponseData {
  content: TogetherInfo[];
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

export interface TogetherResponse {
  resultCode: string;
  msg: string;
  data: TogetherResponseData;
}

export interface TogetherDetailResponse {
  resultCode: string;
  msg: string;
  data: TogetherDetailInfo;
}

export interface TogetherDescriptionResponse {
  resultCode: string;
  msg: string;
  data: string;
}

// 카테고리, 온/오프라인, 모집중/모집완료 ->  타입지정해도 좋을듯
export type TogetherListItemProps = {
  id: number;
  image: string;
  name: string;
  category: string;
  isOnline: string;
  href: string;
  widthClass?: string;
};

import { components } from "@/types/api/v1";

export type TogetherDto = components["schemas"]["TogetherDto"]; // unknown
export type CreateRequest = components["schemas"]["CreateRequest"];

//    api/v1/together/{togetherId}/participate -> unknown
//    api/v1/together/{togetherId}/{memberId}/participation -> unknown
//    api/v1/together/{togetherId}/leave -> unknown
//    api/v1/together/{togetherId}/drop/{targetId} -> unknown

//    api/v1/together/list -> ListResponse
//    api/v1/together/member/{memberId} -> DetailResponse
//    api/v1/together/list/{id} -> DetailResponse
//    api/v1/together/list/{id}/description -> DescriptionResponse

export interface TogetherInfo {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING";
  mode: "ONLINE" | "OFFLINE";
  capacity?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: Participant[] | null;
  thumbnailImage: string | null;
  progress: number | null;
  dDay: number;
}

interface Participant {
  id: number;
  memberId: number;
  togetherId: number;
  participantsStatus: "PARTICIPATING";
  participantRole: "MEMBER" | "LEADER";
}

export type MyTogetherInfo = Omit<TogetherInfo, "dDay" | "participants"> & {
  goal: number;
  participants: {
    id: number;
    memberId: number;
    togetherId: number;
    participantsStatus: "PARTICIPATING" | "LEAVED";
    participantRole: "MEMBER" | "LEADER";
  }[];
};

export type TogetherDetailInfo = {
  id: number;
  title: string;
  category: "CLEANUP" | "PLOGGING" | "RECYCLING";
  mode: "ONLINE" | "OFFLINE";
  capacity?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memberId: number;
  participants: Participant[];
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

export interface MyTogetherResponse {
  resultCode: string;
  msg: string;
  data: MyTogetherInfo[];
}

export interface TogetherParticipatingResponse {
  resultCode: string;
  msg: string;
  data: boolean;
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
  widthClass?: string;
  href?: string;
};

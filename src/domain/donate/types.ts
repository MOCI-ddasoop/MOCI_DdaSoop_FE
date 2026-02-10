import { components } from "@/types/api/v1";

export type DonateInfo = components["schemas"]["ListResponse"];
export type DonateDetailInfo = components["schemas"]["DetailResponse"];

// export interface DonateResponseData {
//   content: DonateInfo[];
//   pageable: {
//     pageNumber: number;
//     pageSize: number;
//     sort: { sorted: boolean; empty: boolean; unsorted: boolean };
//     offset: number;
//     paged: boolean;
//     unpaged: boolean;
//   };
//   totalPages: number;
//   totalElements: number;
//   last: boolean;
//   size: number;
//   number: number;
//   sort: { sorted: boolean; empty: boolean; unsorted: boolean };
//   first: boolean;
//   numberOfElements: number;
//   empty: boolean;
// }

export interface DonateResponse {
  resultCode: string;
  msg: string;
  data: DonateInfo[];
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

import { components } from "@/types/api/v1";

//    api/v1/donation/toss/{donationId}/pay -> DonationPaymentResponse // 금액은 안보내도 되는지 ?
//    api/v1/donation/list -> ListResponse
//    api/v1/donation/list/{id} -> DetailResponse
//    api/v1/donation/list/{id}/donorList -> DonorListResponse
//    api/v1/donation/list/{id}/description -> DescriptionResponse

export type ListResponse = components["schemas"]["ListResponse"];
export type DetailResponse = components["schemas"]["DetailResponse"];
export type DonorListResponse = components["schemas"]["DonorListResponse"];
export type DescriptionResponse = components["schemas"]["DescriptionResponse"];

export type DonateInfo = ListResponse & {
  progress: number;
};

export type DonateDetailInfo = DetailResponse & {
  progress: number;
};

export interface RawDonateResponse {
  resultCode: string;
  msg: string;
  data: ListResponse[];
}
export interface DonateResponse {
  resultCode: string;
  msg: string;
  data: DonateInfo[];
}

export interface RawDonateDetailResponse {
  resultCode: string;
  msg: string;
  data: DetailResponse;
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

export interface DonorList {
  resultCode: string;
  msg: string;
  data: DonorListResponse[];
}

export interface DonateDescription {
  resultCode: string;
  msg: string;
  data: DescriptionResponse;
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
  donationImage?: string;
  name: string;
  amount: number;
  userName: string;
  href?: string;
  type?: "summary" | "tab";
  createdAt?: string;
};

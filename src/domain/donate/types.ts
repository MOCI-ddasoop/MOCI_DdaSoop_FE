import { components } from "@/types/api/v1";

//    api/v1/donation/toss/{donationId}/pay -> DonationPaymentResponse // 금액은 안보내도 되는지 ?
//    api/v1/donation/list -> ListResponse
//    api/v1/donation/list/{id} -> DetailResponse
//    api/v1/donation/list/{id}/donorList -> DonorListResponse
//    api/v1/donation/list/{id}/description -> DescriptionResponse

export type ListResponse = {
  id?: number;
  title?: string;
  /** Format: int64 */
  goalAmount?: number;
  /** Format: int64 */
  currentAmount?: number;
  /** Format: date */
  endDate?: string;
  status?: string;
  thumbnailImage?: string;
  /** @enum {string} */
  category?: "ANIMAL" | "ENVIRONMENT" | "SOCIETY" | "ETC";
  /** Format: int64 */
  dDay?: number;
};
export type DetailResponse = components["schemas"]["DetailResponse"];
export type DescriptionResponse = components["schemas"]["DescriptionResponse"];
export type DonationTossRequest = components["schemas"]["DonationTossRequest"];
export type DonorListResponse = components["schemas"]["ListResponse"];
export type DonationPaymentListResponse =
  components["schemas"]["DonationPaymentListResponse"];
export type RecentDonationPaymentListResponse =
  components["schemas"]["RecentDonationPaymentListResponse"];

export type DonateCreateRequest = {
  title: string;
  description?: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  category: "ANIMAL" | "ENVIRONMENT" | "SOCIETY" | "ETC";
  memberId?: number;
  imageUrls?: string[];
};

export type DonateNewsRequest = {
  donationId: number;
  title: string;
  description?: string;
  progressNews?: string;
  reviews?: string;
};

export type DonateNewsResponse = {
  resultCode: string;
  msg: string;
  data: {
    id: number;
    donationId: number;
    title: string;
    description?: string;
    progressNews?: string;
    reviews?: string;
  };
};

export type DonateInfo = ListResponse & {
  progress: number;
};

export type DonateDetailInfo = DetailResponse & {
  progress: number;
};

export interface RawDonateResponse {
  resultCode: string;
  msg: string;
  data: {
    content: ListResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
export interface DonateResponse {
  resultCode: string;
  msg: string;
  data: {
    content: DonateInfo[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
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
  data: { description: string };
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

export interface MyDonateResponse {
  resultCode: string;
  msg: string;
  data: DonateInfo[];
}

export interface DonateHistoryResponse {
  resultCode: string;
  msg: string;
  data: DonationPaymentListResponse[];
}

export interface RecentDonateResponse {
  resultCode: string;
  msg: string;
  data: RecentDonationPaymentListResponse[];
}

export interface DonationCreatorResponse {
  resultCode: string;
  msg: string;
  data: boolean;
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
  userName?: string;
  href?: string;
  type?: "summary" | "tab" | "mypage";
  createdAt?: string;
};

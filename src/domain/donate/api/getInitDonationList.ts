import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { DonateResponse } from "../types";

export const getInitDonationList = async () => {
  const res = await serverFetchApi(`/api/v1/donation/list`);
  if (!res.ok) {
    throw new Error(
      `후원 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data: DonateResponse = await res.json();
  return data;
};

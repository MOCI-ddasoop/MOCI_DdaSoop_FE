import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { RecentDonateResponse } from "../types";

export const getDonationSummary = async () => {
  const res = await serverFetchApi(`/api/v1/donation/payment/recent`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error(
      new Error(
        `후원하기 최신 내역 조회에 실패했습니다. 오류코드 : ${res.status}`,
      ),
    );
  }

  const data: RecentDonateResponse = await res.json();
  return data;
};

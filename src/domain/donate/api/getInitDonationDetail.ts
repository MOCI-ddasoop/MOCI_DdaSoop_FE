import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { DonateDetailResponse } from "../types";

export const getInitDonationDetail = async (
  id: string,
): Promise<DonateDetailResponse> => {
  const res = await serverFetchApi(`/api/v1/donation/list/${id}`);
  if (!res.ok) {
    throw new Error(
      `후원 상세정보조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data = await res.json();
  const current = data.data.currentAmount ?? 0;
  const goal = data.data.goalAmount ?? 0;
  const progress =
    goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  return {
    resultCode: data.resultCode,
    msg: data.msg,
    data: { ...data.data, progress },
  };
};

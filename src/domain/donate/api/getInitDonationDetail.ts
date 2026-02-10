import { DonateDetailResponse } from "../types";

export const getInitDonationDetail = async (
  id: string,
): Promise<DonateDetailResponse> => {
  const res = await fetch(`http://localhost:8080/api/v1/donation/list/${id}`, {
    cache: "no-store",
  });
  console.log(res);
  if (!res.ok) {
    throw new Error(
      `후원 상세정보조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data = await res.json();
  return data;
};

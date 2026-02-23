import { serverFetchApi } from "@/shared/config/serverFetchApi";

export const getInitDonationList = async () => {
  const res = await serverFetchApi(`/api/v1/donation/list?`);
  if (!res.ok) {
    console.error(
      new Error(`후원 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`),
    );
  }

  const data = await res.json();
  const current = data.data.currentAmount ?? 0;
  const goal = data.data.goalAmount ?? 0;
  const progress = goal > 0 ? Math.round((current * 100) / goal) : 0;

  return {
    resultCode: data.resultCode,
    msg: data.msg,
    data: { ...data.data, progress },
  };
};

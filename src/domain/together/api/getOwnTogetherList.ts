import { serverFetchApi } from "@/shared/config/serverFetchApi";

export const getOwnTogetherList = async (id: number) => {
  const res = await serverFetchApi(`/api/v1/together/${id}`);
  if (!res.ok) {
    throw new Error(
      `나의 함께하기 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data = await res.json();
  return data;
};

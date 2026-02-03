import { fetchApi } from "@/shared/config/fetchApi";
import { TogetherResponse } from "../types";

export const getInitTogetherList = async () => {
  const res = await fetchApi(`/api/v1/together/list?page=0&size=12`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `함께하기 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data: TogetherResponse = await res.json();
  return data;
};

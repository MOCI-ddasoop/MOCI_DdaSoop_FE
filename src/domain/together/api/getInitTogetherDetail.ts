import { fetchApi } from "@/shared/config/fetchApi";
import { TogetherDetailResponse } from "../types";

export const getInitTogetherDetail = async (
  id: string,
): Promise<TogetherDetailResponse> => {
  const res = await fetchApi(`/api/v1/together/list/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(
      `함께하기 상세정보조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data = await res.json();
  return {
    ...data,
    data: {
      ...data.data,
      thumbnailImage: data.data.thumbnailImage
        ? data.data.thumbnailImage.map((url: string) => ({ imageUrl: url }))
        : [],
    },
  };
};

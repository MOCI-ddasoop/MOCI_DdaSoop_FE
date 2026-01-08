import { DetailInfoProps } from "@/domain/participation/types";

export const getInitTogetherDetail = async (
  id: string
): Promise<DetailInfoProps> => {
  const res = await fetch(`http://localhost:8080/api/v1/together/list/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `함께하기 상세정보조회에 실패했습니다. 오류코드 : ${res.status}`
    );
  }

  const data = await res.json();
  return data;
};

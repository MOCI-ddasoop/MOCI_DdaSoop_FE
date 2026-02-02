import { TogetherDescriptionResponse } from "../types";

export const getTogetherDescription = async (id: string | number) => {
  const res = await fetch(
    `http://localhost:8080/api/v1/together/list/${id}/description`,
    { credentials: "include" },
  );

  if (!res.ok) {
    throw new Error(
      `함께하기 info 조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data: TogetherDescriptionResponse = await res.json();
  return data;
};

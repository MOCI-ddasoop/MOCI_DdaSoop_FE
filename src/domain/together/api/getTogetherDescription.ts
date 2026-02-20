import { sanitizeHtml } from "@/server/sanitizeHtml";
import { TogetherDescriptionResponse } from "../types";
import { serverFetchApi } from "@/shared/config/serverFetchApi";

export const getTogetherDescription = async (id: string | number) => {
  const res = await serverFetchApi(`/api/v1/together/list/${id}/description`);

  if (!res.ok) {
    console.error(
      new Error(`함께하기 info 조회에 실패했습니다. 오류코드 : ${res.status}`),
    );
  }

  const data: TogetherDescriptionResponse = await res.json();
  return sanitizeHtml(data.data);
};

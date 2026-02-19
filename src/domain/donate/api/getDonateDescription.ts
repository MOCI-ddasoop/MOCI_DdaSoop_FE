import { sanitizeHtml } from "@/shared/utils/sanitizeHtml/server";
import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { DonateDescription } from "../types";

export const getDonateDescription = async (id: string | number) => {
  const res = await serverFetchApi(`/api/v1/donation/list/${id}/description`);

  if (!res.ok) {
    throw new Error(
      `후원하기 info 조회에 실패했습니다. 오류코드 : ${res.status}`,
    );
  }

  const data: DonateDescription = await res.json();
  return data.data.description ? sanitizeHtml(data.data.description) : null;
};

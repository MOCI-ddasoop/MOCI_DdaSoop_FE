import { getKeyByValue } from "@/shared/utils/getKeyByValue";
import { TogetherResponse } from "../types";
import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { sortType } from "@/shared/constants/filter";

export const getInitTogetherList = async ({
  fixed = false,
  randomList,
}: {
  fixed?: boolean;
  randomList?: string;
} = {}) => {
  const res = await serverFetchApi(
    `/api/v1/together/list?page=0&${fixed ? `size=3&sortType=${getKeyByValue(sortType, randomList!)}` : "size=12"}`,
    { cache: "no-cache" },
  );

  if (!res.ok) {
    console.error(
      new Error(
        `함께하기 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`,
      ),
    );
  }

  const data: TogetherResponse = await res.json();
  return data;
};

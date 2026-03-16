import { serverFetchApi } from "@/shared/config/serverFetchApi";
import { FeedResponse } from "../types";

export const getFeedById = async (id: string | number): Promise<FeedResponse> => {
    const res = await serverFetchApi(`/api/feeds/${id}`);
  
    if (!res.ok) {
      console.error(
        new Error(
          `피드 조회에 실패했습니다. 오류코드 : ${res.status}`,
        ),
      );
    }
  
    const data: FeedResponse = await res.json();
    return data;
};
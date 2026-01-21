import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TogetherResponse } from "../types";

export const useGetTogetherList = (
  {
    category,
    mode,
    status,
    sortType,
    page,
    size,
    userId,
  }: {
    category?: string[];
    mode?: string;
    status?: string;
    sortType?: string;
    page?: number;
    size?: number;
    userId?: number;
  },
  options?: Omit<UseQueryOptions<TogetherResponse>, "queryKey" | "queryFn">
) => {
  return useQuery<TogetherResponse>({
    queryKey: userId
      ? queryKeys.together.member(userId)
      : queryKeys.together.list({
          category,
          mode,
          status,
          sortType,
          page,
          size,
        }),
    queryFn: async () => {
      if (userId) {
        const { data } = await api.get(`api/v1/together/member/${userId}`);
        return data;
      }

      const params = new URLSearchParams(
        Object.entries({ mode, status, sortType, page, size })
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      );

      category?.forEach((c) => {
        params.append("categories", c);
      });

      const { data } = await api.get(
        `api/v1/together/list?${params.toString()}`
      );
      console.log(data);
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
};

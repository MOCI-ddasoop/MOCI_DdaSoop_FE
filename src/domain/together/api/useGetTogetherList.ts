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
    category?: string;
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
    queryKey: queryKeys.together.list({
      category,
      mode,
      status,
      sortType,
      page,
      size,
      userId,
    }),
    queryFn: async () => {
      const baseUrl = userId
        ? `api/v1/together/member/${userId}`
        : `api/v1/together/list`;

      const { data } = await api.get(baseUrl, {
        params: userId
          ? null
          : { category, mode, status, sortType, page, size },
      });
      return data;
    },
    staleTime: 500,
    gcTime: 1000,
    ...options,
  });
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminFeeds } from "./getAdminFeeds";

export const ADMIN_FEEDS_QUERY_KEY = ["admin", "feeds", "list"] as const;

export type AdminFeedsQueryParams = {
  visibility?: string;
  authorId?: number;
  reportedOnly?: boolean;
  page?: number;
  size?: number;
};

export function useAdminFeeds(params: AdminFeedsQueryParams) {
  const { visibility, authorId, reportedOnly, page = 0, size = 20 } = params;

  return useQuery({
    queryKey: [...ADMIN_FEEDS_QUERY_KEY, visibility, authorId, reportedOnly, page, size],
    queryFn: () =>
      getAdminFeeds({
        visibility,
        authorId,
        reportedOnly,
        page,
        size,
      }),
    keepPreviousData: true,
  });
}


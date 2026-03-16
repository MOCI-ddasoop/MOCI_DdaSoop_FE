"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminComments } from "./getAdminComments";

export const ADMIN_COMMENTS_QUERY_KEY = ["admin", "comments", "list"] as const;

export type AdminCommentsQueryParams = {
  commentType?: string;
  authorId?: number;
  reportedOnly?: boolean;
  page?: number;
  size?: number;
};

export function useAdminComments(params: AdminCommentsQueryParams) {
  const { commentType, authorId, reportedOnly, page = 0, size = 20 } = params;

  return useQuery({
    queryKey: [...ADMIN_COMMENTS_QUERY_KEY, commentType, authorId, reportedOnly, page, size],
    queryFn: () =>
      getAdminComments({
        commentType,
        authorId,
        reportedOnly,
        page,
        size,
      }),
  });
}


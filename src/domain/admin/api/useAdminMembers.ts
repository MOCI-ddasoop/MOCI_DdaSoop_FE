"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminMembers } from "./getAdminMembers";

export const ADMIN_MEMBERS_QUERY_KEY = ["admin", "members"] as const;

export function useAdminMembers(page: number, size = 20) {
  return useQuery({
    queryKey: [...ADMIN_MEMBERS_QUERY_KEY, page, size],
    queryFn: () => getAdminMembers({ page, size }),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminMember } from "./getAdminMember";

export function useAdminMember(memberId: number | null) {
  return useQuery({
    queryKey: ["admin", "members", memberId],
    queryFn: () => getAdminMember(memberId!),
    enabled: memberId != null,
  });
}

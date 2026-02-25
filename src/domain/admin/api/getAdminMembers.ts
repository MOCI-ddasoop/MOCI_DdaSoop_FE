import { api } from "@/shared/config/api";
import type { AdminMemberListResponse } from "../types";

/**
 * GET /api/admin/members - 회원 목록
 */
export async function getAdminMembers(params: { page?: number; size?: number }) {
  const { data } = await api.get<AdminMemberListResponse>("/api/admin/members", {
    params: { page: params.page ?? 0, size: params.size ?? 20 },
  });
  return data;
}

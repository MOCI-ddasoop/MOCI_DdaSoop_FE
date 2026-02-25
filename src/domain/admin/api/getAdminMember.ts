import { api } from "@/shared/config/api";
import type { AdminMemberDetailResponse } from "../types";

/**
 * GET /api/admin/members/{memberId} - 회원 상세
 */
export async function getAdminMember(memberId: number) {
  const { data } = await api.get<AdminMemberDetailResponse>(
    `/api/admin/members/${memberId}`
  );
  return data;
}

import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/members/{memberId}/role - 역할 변경
 */
export async function putAdminMemberRole(
  memberId: number,
  role: "USER" | "ADMIN"
) {
  await api.put(`/api/admin/members/${memberId}/role`, { role });
}

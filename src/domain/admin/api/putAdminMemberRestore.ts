import { api } from "@/shared/config/api";

/**
 * PUT /api/admin/members/{memberId}/restore - 복구
 */
export async function putAdminMemberRestore(memberId: number) {
  await api.put(`/api/admin/members/${memberId}/restore`);
}

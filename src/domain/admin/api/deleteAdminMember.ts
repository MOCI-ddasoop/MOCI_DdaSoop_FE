import { api } from "@/shared/config/api";

/**
 * DELETE /api/admin/members/{memberId} - 탈퇴 처리
 */
export async function deleteAdminMember(memberId: number) {
  await api.delete(`/api/admin/members/${memberId}`);
}

import { api } from "@/shared/config/api";

/**
 * GET /api/admin - 관리자 진입 확인
 */
export async function checkAdmin() {
  await api.get("/api/admin");
}

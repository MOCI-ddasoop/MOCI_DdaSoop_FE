import { api } from "@/shared/config/api";

export const checkEmail = async (email: string) => {
  try {
    const res = await api.post("/api/members/check-email", { email });
    return res.data;
  } catch (error) {
    throw new Error("이메일 중복 체크 실패");
  }
};
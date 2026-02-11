import { api } from "@/shared/config/api";
import { NicknameCheckResponse } from "../types";

export const checkNickname = async (
  nickname: string
): Promise<NicknameCheckResponse> => {
  const res = await api.post("/api/members/check-nickname", { nickname });
  return res.data;
}
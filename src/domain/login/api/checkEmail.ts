import { api } from "@/shared/config/api";
import { EmailCheckResponse } from "../types";

export const checkEmail = async (
  email: string
): Promise<EmailCheckResponse> => {
  const res = await api.post("/api/members/check-email", { email });
  return res.data;
}
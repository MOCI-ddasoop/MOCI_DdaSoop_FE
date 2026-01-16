import { api } from "@/shared/config/api";

export const checkNickname = async (nickname: string) => {
  try{
    const res = await api.post("/api/members/check-nickname", { nickname });
    return res.data;
  }catch(error){
    throw new Error("닉네임 중복 체크 실패"); 
  }
};
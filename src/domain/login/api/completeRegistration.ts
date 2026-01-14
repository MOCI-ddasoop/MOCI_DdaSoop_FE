import { api } from "@/shared/config/api";
import { AxiosError } from "axios";

export const completeRegistration = async (data:{temporaryToken: string, nickname: string, email: string}) => {
  try{
    const res = await api.post("/api/auth/complete-registration", data,{
      withCredentials: true,
    });
    return res.data;
  }catch(error){
    const axiosError = error as AxiosError<{message: string}>;

    if(axiosError.response){
      const message = axiosError.response.data?.message;
      switch(axiosError.response.status){
        case 400:
          throw new Error(message || "잘못된 요청입니다.");
        case 404:
          throw new Error("회원 정보를 찾을 수 없습니다.");
        default:
          throw new Error("회원가입 중 오류가 발생했습니다.");
      }
    }
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
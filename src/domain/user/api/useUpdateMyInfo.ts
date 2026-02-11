import { api } from "@/shared/config/api";
import { MembersMe, useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type UpdateMyInfoRequest = {
  email:string;
  nickname:string;
  profileImageUrl:string;
}

type UpdateMyInfoError = {
  code:string;
  message:string;
}

export const useUpdateMyInfo = () => {
  return useMutation<
    MembersMe,
    AxiosError<UpdateMyInfoError>,
    UpdateMyInfoRequest
  >({
    mutationFn: async (data) => {
      const res = await api.put<MembersMe>("/api/members/me", data);
      return res.data;
    },
      onSuccess: (updatedMe) => {
        useAuthStore.setState({ me: updatedMe });
      },
    });
  };
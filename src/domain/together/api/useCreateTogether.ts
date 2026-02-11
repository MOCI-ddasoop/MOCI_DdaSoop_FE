import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation } from "@tanstack/react-query";
import { CreateRequest } from "../types";

export const useCreateTogether = () => {
  return useMutation({
    mutationKey: queryKeys.together.join(),
    mutationFn: (newTogetherInfo: CreateRequest) => {
      console.log(newTogetherInfo);
      const res = api.post(`api/v1/together`, newTogetherInfo);
      return res;
    },
  });
};

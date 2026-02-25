import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRequest } from "../types";

export const useCreateTogether = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.together.new(),
    mutationFn: (newTogetherInfo: CreateRequest) => {
      const res = api.post(`api/v1/together`, newTogetherInfo);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["together", "list"],
      });
    },
  });
};

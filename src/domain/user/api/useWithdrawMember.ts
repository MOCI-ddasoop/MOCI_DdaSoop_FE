"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";

type WithdrawMemberRequest = {
  reason?: string;
};

type WithdrawMemberResponse = {
  message?: string;
};

export const useWithdrawMember = (
  options?: UseMutationOptions<
    AxiosResponse<WithdrawMemberResponse>,
    AxiosError,
    WithdrawMemberRequest
  >
) => {
  return useMutation({
    mutationKey: queryKeys.members.me(),
    mutationFn: (data: WithdrawMemberRequest) => {
      return api.delete<WithdrawMemberResponse>("/api/members/me", {
        data,
      });
    },
    ...options,
  });
};

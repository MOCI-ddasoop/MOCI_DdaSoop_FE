import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { TogetherParticipatingResponse } from "../types";
export const useCheckIsMember = ({
  togetherId,
  userId,
  isLogin,
}: {
  togetherId: number;
  userId: number | undefined;
  isLogin: boolean;
}) => {
  return useQuery<TogetherParticipatingResponse>({
    queryKey: queryKeys.together.isParticipating(),
    queryFn: async () => {
      const { data } = await api.get(
        `api/v1/together/${togetherId}/${userId}/participation`,
      );
      return data;
    },
    enabled: isLogin && !!userId && !!togetherId,
    staleTime: 500,
    gcTime: 1000,
  });
};

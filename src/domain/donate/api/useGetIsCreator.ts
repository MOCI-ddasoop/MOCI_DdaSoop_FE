import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DonationCreatorResponse } from "../types";

export const useGetIsCreator = ({
  id,
  memberId,
}: {
  id: string;
  memberId: number;
}) =>
  useQuery<DonationCreatorResponse>({
    queryKey: queryKeys.donate.isCreator({ id, memberId }),
    queryFn: async () => {
      const { data } =
        memberId === -1
          ? {
              data: {
                resultCode: "FAIL",
                msg: "로그인이 필요합니다",
                data: null,
              },
            }
          : await api.get(`api/v1/donation/${id}/${memberId}`);
      return data;
    },
    enabled: !!id && !!memberId,
  });

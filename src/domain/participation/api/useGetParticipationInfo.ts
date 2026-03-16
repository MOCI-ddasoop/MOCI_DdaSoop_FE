import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { DonateDescriptionResponse } from "@/domain/donate/types";
import { TogetherDescriptionResponse } from "@/domain/together/types";

export const useGetParticipationInfo = (
  type: "together" | "donate",
  id: string | number,
) => {
  return useQuery<TogetherDescriptionResponse | DonateDescriptionResponse>({
    queryKey: [type, id, "description"],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/${type === "donate" ? "donation" : type}/list/${id}/description`,
      );
      return data;
    },
  });
};

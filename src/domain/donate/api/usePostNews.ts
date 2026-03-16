import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation } from "@tanstack/react-query";
import { DonateNewsRequest } from "../types";

export const usePostNews = (id: string) => {
  return useMutation({
    mutationKey: queryKeys.donate.newsCreate(id),
    mutationFn: async (contents: string) => {
      const newNews: DonateNewsRequest = {
        donationId: Number(id),
        title: new Date(Date.now()).toISOString().split("T")[0],
        description: contents,
      };

      const res = await api.post(`api/v1/donation/notice/create`, newNews);
      return res;
    },
  });
};

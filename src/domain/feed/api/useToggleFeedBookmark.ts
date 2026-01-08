"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleFeedBookmark = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (feedId: string) => {
      const res = api.post(`api/feeds/${feedId}/bookmarks`);
      return res;
    },
    onSuccess(_data, variables) {
      qc.invalidateQueries({ queryKey: queryKeys.feeds.id(variables) });
    },
  });
};

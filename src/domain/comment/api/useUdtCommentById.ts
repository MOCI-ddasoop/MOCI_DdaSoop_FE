import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUdtCommentById = (feedId?: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.comments.upt(),
    mutationFn: ({ id, content }: { id: string | number; content: string }) => {
      const res = api.put(`api/comments/${id}`, { content });
      return res;
    },
    onSuccess: () => {
      if (feedId) {
        qc.invalidateQueries({
          queryKey: queryKeys.comments.list(
            typeof feedId === "string" ? feedId : String(feedId)
          ),
        });
      }
    },
  });
};

"use client";

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { TogetherDetailInfo } from "../types";

function DetailInfoHydrator({
  initialData,
  children,
}: {
  initialData: TogetherDetailInfo;
  children: React.ReactNode;
}) {
  useQuery({
    queryKey: queryKeys.together.id(String(initialData.id)),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/together/list/${initialData.id}`);
      return data;
    },
    initialData,
    staleTime: 60000,
  });
  return <>{children}</>;
}

export default DetailInfoHydrator;

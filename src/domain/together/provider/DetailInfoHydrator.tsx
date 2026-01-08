"use client";

import { DetailInfoProps } from "@/domain/participation/types";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

function DetailInfoHydrator({
  initialData,
  children,
}: {
  initialData: DetailInfoProps;
  children: React.ReactNode;
}) {
  useQuery({
    queryKey: queryKeys.together.id(initialData.id),
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

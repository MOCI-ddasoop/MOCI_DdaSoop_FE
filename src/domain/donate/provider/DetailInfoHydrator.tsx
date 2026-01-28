"use client";

import { TogetherDetailInfo } from "@/domain/together/types";
import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { DonateDetailInfo } from "../types";

type DetailInfoHydratorProps =
  | {
      type: "together";
      initialData: TogetherDetailInfo;
      children: React.ReactNode;
    }
  | {
      type: "donate";
      initialData: DonateDetailInfo;
      children: React.ReactNode;
    };

function DetailInfoHydrator({
  type,
  initialData,
  children,
}: DetailInfoHydratorProps) {
  useQuery({
    queryKey: queryKeys[type].id(String(initialData.id)),
    queryFn: async () => {
      const { data } = await api.get(`api/v1/${type}/list/${initialData.id}`);
      return data;
    },
    initialData,
    staleTime: 60000,
  });
  return <>{children}</>;
}

export default DetailInfoHydrator;

import { api } from "@/shared/config/api";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TogetherDetailResponse } from "../types";

export const useGetTogetherById = (
	id: string,
	options?: Omit<
		UseQueryOptions<TogetherDetailResponse>,
		"queryKey" | "queryFn"
	>,
) => {
	return useQuery<TogetherDetailResponse>({
		queryKey: queryKeys.together.id(id),
		queryFn: async () => {
			const { data } = await api.get(`api/v1/together/list/${id}`);
			return {
				...data,
				data: {
					...data.data,
					thumbnailImage: data.data.thumbnailImage
						? data.data.thumbnailImage.map((url: string) => ({ imageUrl: url }))
						: [],
				},
			};
		},
		enabled: !!id,
		staleTime: 500,
		gcTime: 1000,
		...options,
	});
};

import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import { ReportCreateRequest } from "../type";
import { api } from "@/shared/config/api";
import { AxiosError } from "axios";

interface ReportErrorResponse {
	errorCode: string;
	message: string;
	status: number;
	timestamp: string;
}

export const usePostReport = (
	options?: UseMutationOptions<
		unknown,
		AxiosError<ReportErrorResponse>,
		ReportCreateRequest
	>,
) => {
	const qc = useQueryClient();

	return useMutation({
		...options,
		mutationFn: async (reportData: ReportCreateRequest) => {
			const { data } = await api.post("api/reports", reportData);
			return data;
		},
		onSuccess: (data, variables, context, mutation) => {
			qc.invalidateQueries({
				queryKey: queryKeys.report.create(),
			});

			options?.onSuccess?.(data, variables, context, mutation);
		},
	});
};

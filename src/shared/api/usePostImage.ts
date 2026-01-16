import { api } from "../config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ImageUploadResponse } from "../types/types";
import { AxiosError } from "axios";

type ImageUploadBackendError = {
	code: string;
	message: string;
};

export const usePostImage = (
	options?: UseMutationOptions<
		ImageUploadResponse[],
		AxiosError<ImageUploadBackendError>,
		File[]
	>
) => {
	return useMutation({
		mutationFn: async (files: File[]) => {
			const formData = new FormData();
			files.forEach((file) => formData.append("files", file));
			const { data } = await api.post("api/images/upload-multiple", formData);
			return data;
		},
		...options,
	});
};

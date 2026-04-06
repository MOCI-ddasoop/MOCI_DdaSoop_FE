import { api } from "../config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ImageUploadResponse } from "../types/types";
import { AxiosError } from "axios";
import { compressImages } from "@/shared/utils/compressImage";

type ImageUploadBackendError = {
	code: string;
	message: string;
};

export const usePostImage = (
	options?: UseMutationOptions<
		ImageUploadResponse[],
		AxiosError<ImageUploadBackendError>,
		File[]
	>,
) => {
	return useMutation({
		mutationFn: async (files: File[]) => {
			const compressedFiles = await compressImages(files, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
			});

			const formData = new FormData();
			compressedFiles.forEach((file) => formData.append("files", file));
			const { data } = await api.post("api/images/upload-multiple", formData);
			return data;
		},
		...options,
	});
};

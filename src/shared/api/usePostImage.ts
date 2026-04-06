import { api } from "../config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ImageUploadResponse } from "../types/types";
import { AxiosError } from "axios";
import { compressImages } from "@/shared/utils/compressImage";
import { useState } from "react";

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
	const [compressionProgress, setCompressionProgress] = useState<{
		current: number;
		total: number;
	} | null>(null);

	const mutation = useMutation({
		mutationFn: async (files: File[]) => {
			const compressedFiles = await compressImages(files, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1280,
				onProgress: setCompressionProgress,
			});

			setCompressionProgress(null);

			const formData = new FormData();
			compressedFiles.forEach((file) => formData.append("files", file));
			const { data } = await api.post("api/images/upload-multiple", formData);
			return data;
		},
		...options,
	});

	return {
		...mutation,
		compressionProgress,
	};
};

import imageCompression from "browser-image-compression";

interface CompressImagesOptions {
	maxSizeMB?: number;
	maxWidthOrHeight?: number;
	useWebWorker?: boolean;
	onProgress?: (progress: { current: number; total: number }) => void;
}

/**
 * 다중 이미지 파일을 압축하는 유틸 함수
 * @param files - 압축할 이미지 파일 배열
 * @param options - 압축 옵션 (선택사항)
 * @returns 압축된 File 객체 배열
 */
export async function compressImages(
	files: File[],
	options?: CompressImagesOptions,
): Promise<File[]> {
	const compressionOptions = {
		maxSizeMB: options?.maxSizeMB ?? 1,
		maxWidthOrHeight: options?.maxWidthOrHeight ?? 1920,
		useWebWorker: options?.useWebWorker ?? true,
	};

	const compressedFiles: File[] = [];

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		// 이미 목표 사이즈 이하면 압축 스킵
		if (file.size <= compressionOptions.maxSizeMB * 1024 * 1024) {
			compressedFiles.push(file);
		} else {
			const compressedBlob = await imageCompression(file, compressionOptions);

			// Blob → File 변환 (원본 파일명 유지)
			compressedFiles.push(
				new File([compressedBlob], file.name, {
					type: compressedBlob.type,
					lastModified: Date.now(),
				}),
			);
		}

		// 진행 상황 업데이트
		options?.onProgress?.({
			current: i + 1,
			total: files.length,
		});
	}

	return compressedFiles;
}

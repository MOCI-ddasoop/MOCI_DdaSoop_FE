import imageCompression from "browser-image-compression";

interface CompressImagesOptions {
	maxSizeMB?: number;
	maxWidthOrHeight?: number;
	useWebWorker?: boolean;
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

	const compressedFiles = await Promise.all(
		files.map(async (file) => {
			const originalSize = file.size;
			const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(2);

			// 이미 목표 사이즈 이하면 압축 스킵
			if (file.size <= compressionOptions.maxSizeMB * 1024 * 1024) {
				console.log(
					`📁 ${file.name}: 이미 ${originalSizeMB}MB로 목표 크기 이하이므로 압축을 생략합니다.`,
				);
				return file;
			}

			console.log(`🗜️ ${file.name}: 압축 시작 (${originalSizeMB}MB)`);
			const compressedBlob = await imageCompression(file, compressionOptions);
			const compressedSize = compressedBlob.size;
			const compressedSizeMB = (compressedSize / (1024 * 1024)).toFixed(2);
			const compressionRatio = (
				((originalSize - compressedSize) / originalSize) *
				100
			).toFixed(1);

			console.log(
				`✅ ${file.name}: 압축 완료 (${originalSizeMB}MB → ${compressedSizeMB}MB, ${compressionRatio}% 감소)`,
			);

			// Blob → File 변환 (원본 파일명 유지)
			return new File([compressedBlob], file.name, {
				type: compressedBlob.type,
				lastModified: Date.now(),
			});
		}),
	);

	return compressedFiles;
}

import type { components } from "@/types/api/v1";

export type ImageUploadResponse = components["schemas"]["ImageUploadResponse"];

// 모든 이미지의 공통 베이스 타입
export type ImageBase = Pick<
	ImageUploadResponse,
	"imageUrl" | "width" | "height" | "fileSize" | "originalFileName"
>;

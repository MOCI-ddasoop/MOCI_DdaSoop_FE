import type { components } from "@/types/api/v1";

export type CommentCreateRequest =
	components["schemas"]["CommentCreateRequest"];
export type CommentUpdateRequest =
	components["schemas"]["CommentUpdateRequest"];
export type CommentResponse = components["schemas"]["CommentResponse"];
export type Page = components["schemas"]["Page"];

export type CommentPage = Omit<Page, "content"> & {
	content: CommentResponse[];
};

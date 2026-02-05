import { ImageBase } from "@/shared/types/types";
import { createStore, StoreApi } from "zustand";
import { FeedResponse, FeedUpdateRequest } from "../types";
import { immer } from "zustand/middleware/immer";

type FeedDraft = Omit<FeedUpdateRequest, "images"> & { images: ImageBase[] };

export type FeedEditStore = {
	isEditMode: boolean;
	draft: FeedDraft;

	actions: {
		enterEdit(): void;
		exitEdit(): void;

		toUpdatePayload(contentHtml: string): FeedUpdateRequest;

		setImages(images: FeedDraft["images"]): void;
		setContent(content: string): void;
		setTags(tags: string[]): void;
		setVisibility(v: FeedDraft["visibility"]): void;

		reset(): void;
	};
};

export function createFeedEditStore(
	feed: FeedResponse,
): StoreApi<FeedEditStore> {
	const createInitialDraft = (): FeedDraft => ({
		content: feed.content ?? "",
		images: feed.images ?? [],
		tags: feed.tags ?? [],
		visibility: feed.visibility,
	});

	return createStore(
		immer<FeedEditStore>((set, get) => ({
			isEditMode: false,
			draft: createInitialDraft(),

			actions: {
				enterEdit: () => set({ isEditMode: true }),
				exitEdit: () => set({ isEditMode: false, draft: createInitialDraft() }),

				toUpdatePayload: (contentHtml) => {
					const { draft } = get();
					return {
						content: contentHtml,
						images: draft.images.map((img, index) => {
							if (!img.imageUrl || img.width == null || img.height == null) {
								throw new Error("이미지 메타데이터가 완성되지 않았습니다.");
							}

							return {
								imageUrl: img.imageUrl,
								width: img.width,
								height: img.height,
								displayOrder: index,
								fileSize: img.fileSize,
								originalFileName: img.originalFileName,
							};
						}),
						visibility: draft.visibility,
						tags: draft.tags,
					};
				},

				setImages: (images) =>
					set((state) => {
						state.draft.images = images;
					}),

				setContent: (content) =>
					set((state) => {
						state.draft.content = content;
					}),

				setTags: (tags) =>
					set((state) => {
						state.draft.tags = tags;
					}),

				setVisibility: (visibility) =>
					set((state) => {
						state.draft.visibility = visibility;
					}),

				reset: () =>
					set({
						isEditMode: false,
						draft: createInitialDraft(),
					}),
			},
		})),
	);
}

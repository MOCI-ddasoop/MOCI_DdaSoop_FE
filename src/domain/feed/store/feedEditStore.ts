import { ImageBase } from "@/shared/types/types";
import { createStore, StoreApi } from "zustand";
import { FeedResponse, FeedUpdateRequest } from "../types";

type FeedDraft = Omit<FeedUpdateRequest, "images"> & { images: ImageBase[] };

export type FeedEditStore = {
	isEditMode: boolean;
	draft: FeedDraft;

	enterEdit: () => void;
	exitEdit: () => void;

	setImages: (images: FeedDraft["images"]) => void;
	setContent: (content: string) => void;
	setTags: (tags: string[]) => void;
	setVisibility: (v: FeedDraft["visibility"]) => void;
};

export function createFeedEditStore(
	feed: FeedResponse,
): StoreApi<FeedEditStore> {
	const initialDraft: FeedDraft = {
		content: feed.content ?? "",
		images: feed.images ?? [],
		tags: feed.tags ?? [],
		visibility: feed.visibility,
	};

	return createStore((set) => ({
		isEditMode: false,
		draft: initialDraft,

		enterEdit: () => set({ isEditMode: true }),
		exitEdit: () => set({ isEditMode: false, draft: initialDraft }),

		setImages: (images) =>
			set((state) => ({
				draft: {
					...state.draft,
					images,
				},
			})),

		setContent: (content) =>
			set((state) => ({
				draft: {
					...state.draft,
					content,
				},
			})),

		setTags: (tags) =>
			set((state) => ({
				draft: {
					...state.draft,
					tags,
				},
			})),

		setVisibility: (visibility) =>
			set((state) => ({
				draft: {
					...state.draft,
					visibility,
				},
			})),
	}));
}

import { createStore, StoreApi } from "zustand";

export interface CommentScrollState {
	lastCreatedCommentId: number | null;
	lastCreatedCommentParentId: number | null;
	openedReplyParentId: number | null;

	actions: {
		setLastComment(id: number | null): void;
		setLastReplyParent(id: number | null): void;
		openReply(parentId: number | null): void;
		reset(): void;
	};
}

export function createCommentScrollStore(): StoreApi<CommentScrollState> {
	return createStore((set) => ({
		lastCreatedCommentId: null,
		lastCreatedCommentParentId: null,
		openedReplyParentId: null,

		actions: {
			setLastComment: (id) => set({ lastCreatedCommentId: id }),

			setLastReplyParent: (id) => set({ lastCreatedCommentParentId: id }),

			openReply: (parentId) => set({ openedReplyParentId: parentId }),

			reset: () =>
				set({
					lastCreatedCommentId: null,
					lastCreatedCommentParentId: null,
					openedReplyParentId: null,
				}),
		},
	}));
}

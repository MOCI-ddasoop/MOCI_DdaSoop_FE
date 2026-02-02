import { create } from "zustand";

interface CommentScrollState {
	lastCreatedCommentId: number | null;
	setLastCreatedCommentId: (id: number | null) => void;

	lastCreatedCommentParentId: number | null;
	setLastCreatedCommentParentId: (id: number | null) => void;

	openedReplyParentId: number | null;
	setOpenedReplyParentId: (id: number | null) => void;
}

export const useCommentScrollStore = create<CommentScrollState>((set) => ({
	lastCreatedCommentId: null,
	setLastCreatedCommentId: (id) => set({ lastCreatedCommentId: id }),

	lastCreatedCommentParentId: null,
	setLastCreatedCommentParentId: (id) =>
		set({ lastCreatedCommentParentId: id }),

	openedReplyParentId: null,
	setOpenedReplyParentId: (id) => set({ openedReplyParentId: id }),
}));

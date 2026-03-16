import { createContext, useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { CommentScrollState } from "../store/commentScrollStore";

export const CommentScrollContext =
	createContext<StoreApi<CommentScrollState> | null>(null);

export function CommentScrollProvider({
	store,
	children,
}: {
	store: StoreApi<CommentScrollState>;
	children: React.ReactNode;
}) {
	if (store)
		return (
			<CommentScrollContext.Provider value={store}>
				{children}
			</CommentScrollContext.Provider>
		);
}

// context 밖에서 사용할 더미 store
const DEFAULT_STORE = createStore<CommentScrollState>(() => ({
	lastCreatedCommentId: null,
	lastCreatedCommentParentId: null,
	openedReplyParentId: null,
	actions: {
		setLastComment: () => {},
		setLastReplyParent: () => {},
		openReply: () => {},
		reset: () => {},
	},
}));

export function useCommentScrollStore<T>(
	selector: (state: CommentScrollState) => T,
) {
	const store = useContext(CommentScrollContext);

	return useStore(store ?? DEFAULT_STORE, selector);
}

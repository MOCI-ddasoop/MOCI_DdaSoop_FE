import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";
import {
	CommentScrollState,
	createCommentScrollStore,
} from "../store/commentScrollStore";

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

const DEFAULT_STORE = createCommentScrollStore();

export function useCommentScrollStore<T>(
	selector: (state: CommentScrollState) => T,
) {
	const store = useContext(CommentScrollContext);

	return useStore(store ?? DEFAULT_STORE, selector);
}

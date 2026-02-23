import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";
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

export function useCommentScrollStore<T>(
	selector: (state: CommentScrollState) => T,
) {
	const store = useContext(CommentScrollContext);
	if (!store) {
		throw new Error(
			"useFeedEditStore must be used within FeedEditStoreProvider",
		);
	}
	return useStore(store, selector);
}

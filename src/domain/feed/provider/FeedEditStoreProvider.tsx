import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { FeedEditStore } from "../store/feedEditStore";

export const FeedEditStoreContext =
	createContext<StoreApi<FeedEditStore> | null>(null);

export function FeedEditStoreProvider({
	store,
	children,
}: {
	store: StoreApi<FeedEditStore> | undefined;
	children: React.ReactNode;
}) {
	if (store)
		return (
			<FeedEditStoreContext.Provider value={store}>
				{children}
			</FeedEditStoreContext.Provider>
		);
}

export function useFeedEditStore<T>(selector: (state: FeedEditStore) => T) {
	const store = useContext(FeedEditStoreContext);
	if (!store) {
		throw new Error(
			"useFeedEditStore must be used within FeedEditStoreProvider",
		);
	}
	return useStore(store, selector);
}

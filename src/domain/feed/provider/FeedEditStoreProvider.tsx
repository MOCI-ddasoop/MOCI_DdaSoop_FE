import { createContext } from "react";
import { StoreApi } from "zustand";
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
export default FeedEditStoreProvider;

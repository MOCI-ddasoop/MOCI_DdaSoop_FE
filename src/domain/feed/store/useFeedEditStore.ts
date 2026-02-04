import { useContext } from "react";
import { FeedEditStore } from "./feedEditStore";
import { FeedEditStoreContext } from "../provider/FeedEditStoreProvider";
import { useStore } from "zustand";

export function useFeedEditStore<T>(selector: (state: FeedEditStore) => T) {
	const store = useContext(FeedEditStoreContext);
	if (!store) {
		throw new Error(
			"useFeedEditStore must be used within FeedEditStoreProvider",
		);
	}
	return useStore(store, selector);
}

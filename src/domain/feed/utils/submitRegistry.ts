export type SubmitOwner = "feed-edit" | "comment-create" | "comment-edit";

export type SubmitEntry = {
	submit: () => void | Promise<void>;
	enabled: () => boolean;
};

export type SubmitRegistry = {
	register: (owner: SubmitOwner, entry: SubmitEntry) => void;
	unregister: (owner: SubmitOwner) => void;
	submitByOwner: (owner: SubmitOwner) => Promise<void>;
};

export function createSubmitRegistry() {
	const registry = new Map<SubmitOwner, SubmitEntry>();
	return {
		register(owner: SubmitOwner, entry: SubmitEntry) {
			registry.set(owner, entry);
		},
		unregister(owner: SubmitOwner) {
			registry.delete(owner);
		},
		async submitByOwner(owner: SubmitOwner) {
			console.log("[submitByOwner] called:", owner);
			const entry = registry.get(owner);
			if (!entry) {
				console.log("[submitByOwner] no entry for owner");
				return;
			}

			if (!entry.enabled()) {
				console.log("[submitByOwner] blocked by enabled()");
				return;
			}

			console.log("[submitByOwner] executing submit()");
			await entry.submit();
		},
	};
}

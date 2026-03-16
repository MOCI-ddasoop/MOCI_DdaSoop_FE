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
			const entry = registry.get(owner);
			if (!entry) {
				return;
			}

			if (!entry.enabled()) {
				return;
			}

			await entry.submit();
		},
	};
}

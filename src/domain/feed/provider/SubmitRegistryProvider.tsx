import { createContext, useContext, useEffect, useState } from "react";
import {
	createSubmitRegistry,
	SubmitOwner,
	SubmitRegistry,
} from "../utils/submitRegistry";

export const SubmitRegistryContext = createContext<SubmitRegistry | null>(null);

export function SubmitRegistryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [registry] = useState(() => createSubmitRegistry());

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.isComposing) return;
			if (e.key !== "Enter") return;
			if (e.metaKey || e.ctrlKey) return;

			const active = document.activeElement as HTMLElement | null;

			const owner = active?.closest<HTMLElement>("[data-submit-owner]")?.dataset
				.submitOwner as SubmitOwner | undefined;

			if (!owner) return;

			e.preventDefault();
			registry.submitByOwner(owner);
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [registry]);

	return (
		<SubmitRegistryContext.Provider value={registry}>
			{children}
		</SubmitRegistryContext.Provider>
	);
}

export function useSubmitRegistry() {
	const ctx = useContext(SubmitRegistryContext);
	if (!ctx) {
		throw new Error(
			"useSubmitRegistry must be used within SubmitRegistryProvider",
		);
	}
	return ctx;
}

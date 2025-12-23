import { useEffect, useRef } from "react";

export function useIntersection(onIntersect: () => void, enabled = true) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!enabled || !ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) onIntersect();
			},
			{
				root: null,
				threshold: 0,
				rootMargin: "200px",
			}
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [enabled, onIntersect]);

	return ref;
}

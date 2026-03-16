import { useEffect, useRef } from "react";

export function useIntersection({
	onIntersect,
	enabled = true,
	rootMargin = "200px",
	isFetching,
	hasNextPage,
}: {
	onIntersect: () => void;
	enabled?: boolean;
	rootMargin?: string;
	isFetching: boolean;
	hasNextPage: boolean;
}) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!enabled || !ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				if (isFetching) return;
				if (!hasNextPage) return;

				onIntersect();
			},
			{
				root: null,
				threshold: 0,
				rootMargin,
			},
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [enabled, hasNextPage, isFetching, onIntersect, rootMargin]);

	return ref;
}

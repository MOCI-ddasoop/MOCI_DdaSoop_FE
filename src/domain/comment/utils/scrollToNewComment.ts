export function scrollToNewComment(
	container: HTMLElement,
	target: HTMLElement,
) {
	const containerRect = container.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	const OFFSET_BOTTOM = 100;

	const scrollTop =
		container.scrollTop +
		(targetRect.bottom - containerRect.bottom) +
		OFFSET_BOTTOM;

	container.scrollTo({
		top: scrollTop,
		behavior: "smooth",
	});
}

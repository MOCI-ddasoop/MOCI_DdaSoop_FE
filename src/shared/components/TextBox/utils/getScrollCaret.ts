function getCaretRect(): DOMRect | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;

	const range = selection.getRangeAt(0).cloneRange();

	// caret range는 width/height 0일 수 있음 → 최소 1px 확보
	if (range.collapsed) {
		range.setEnd(range.startContainer, range.startOffset);
	}

	const rects = range.getClientRects();
	if (rects.length > 0) return rects[0];

	return range.getBoundingClientRect();
}

export function getScrollCaret(root: HTMLElement) {
	const caretRect = getCaretRect();
	if (!caretRect) return;

	const containerRect = root.getBoundingClientRect();

	const padding = 8; // 여유 공간

	if (caretRect.bottom > containerRect.bottom) {
		root.scrollTop += caretRect.bottom - containerRect.bottom + padding;
	} else if (caretRect.top < containerRect.top) {
		root.scrollTop -= containerRect.top - caretRect.top + padding;
	}
}

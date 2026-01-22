export function normalizeZWS(root: HTMLElement) {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	const caretNode = range.startContainer;
	const caretOffset = range.startOffset;

	const inlines = root.querySelectorAll("span,a");
	inlines.forEach((inline) => {
		const textNodes = Array.from(inline.childNodes).filter(
			(n) => n.nodeType === Node.TEXT_NODE,
		) as Text[];

		textNodes.forEach((n) => {
			if (!n.nodeValue) return;
			if (n.nodeValue === "\u200B") return;
			if (!n.nodeValue.includes("\u200B")) return;

			const isCaretNode = n === caretNode;

			let meaningfulOffset = 0;

			if (isCaretNode) {
				meaningfulOffset = n.nodeValue
					.slice(0, caretOffset)
					.replace(/\u200B/g, "").length;
			}

			const cleaned = n.nodeValue.replace(/\u200B/g, "");

			n.nodeValue = cleaned;

			// caret 복구
			if (isCaretNode) {
				const newOffset = Math.min(meaningfulOffset, cleaned.length);

				const newRange = document.createRange();
				newRange.setStart(n, newOffset);
				newRange.collapse(true);

				selection.removeAllRanges();
				selection.addRange(newRange);
			}
		});
	});
}

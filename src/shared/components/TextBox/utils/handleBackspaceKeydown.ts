export function handleBackspaceKeydown(e: React.KeyboardEvent<HTMLDivElement>) {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	const container = range.startContainer;
	const offset = range.startOffset;

	let shouldHandle = false;

	let nextCaretRange: Range | null = null;

	if (container.nodeType !== Node.TEXT_NODE || offset === 1) {
		const parent = container.parentElement;
		if (
			parent &&
			(parent instanceof HTMLSpanElement ||
				parent instanceof HTMLAnchorElement) &&
			parent.previousElementSibling?.tagName === "BR"
		) {
			// 브라우저 기본 삭제 막기
			shouldHandle = true;

			// ZWSP가 아직 없는 경우 → 삽입만 하고 종료
			if (!container.textContent?.startsWith("\u200B")) {
				e.preventDefault();
				const original = container.textContent;

				container.textContent = "\u200B" + original?.slice(1);

				const newRange = document.createRange();
				newRange.setStart(container, 1);
				newRange.collapse(true);
				selection.removeAllRanges();
				selection.addRange(newRange);

				return;
			}

			// ZWSP-only → 직접 삭제
			if (container.textContent === "\u200B") {
				let prevInline: Element | null = parent.previousElementSibling;
				while (
					prevInline &&
					!(
						prevInline instanceof HTMLSpanElement ||
						prevInline instanceof HTMLAnchorElement
					)
				) {
					prevInline = prevInline.previousElementSibling;
				}

				if (!prevInline) return;

				// 삭제 후 caret 목적지 Range 생성
				const textNode = prevInline.firstChild;
				if (textNode && textNode.nodeType === Node.TEXT_NODE) {
					const range = document.createRange();
					const textLength = (textNode as Text).data.length;

					range.setStart(textNode, Math.max(textLength, 1));
					range.collapse(true);

					nextCaretRange = range.cloneRange();
				}
				e.preventDefault();

				const br = parent.previousElementSibling;
				parent.remove();
				if (br?.tagName === "BR") br.remove();
			}
		}
	}
	if (shouldHandle && nextCaretRange) {
		requestAnimationFrame(() => {
			const sel = window.getSelection();
			if (!sel) return;
			sel.removeAllRanges();
			sel.addRange(nextCaretRange);
		});
	}
}

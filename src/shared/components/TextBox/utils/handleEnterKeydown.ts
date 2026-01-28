export function handleEnterKeydown() {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	const container = range.startContainer;

	if (
		container.nodeType === Node.TEXT_NODE &&
		container.parentElement &&
		(container.parentElement instanceof HTMLSpanElement ||
			container.parentElement instanceof HTMLAnchorElement)
	) {
		const inline = container.parentElement;
		const offset = range.startOffset;
		const textNode = container as Text;

		const br = document.createElement("br");
		const zwsSpan = inline.cloneNode(false) as HTMLElement;
		const nextInline = inline.cloneNode(false) as HTMLElement;
		// afterText를 먼저 저장
		const afterText = textNode.textContent!.substring(offset);

		// 현재 텍스트는 offset까지만 유지
		textNode.textContent = textNode.textContent!.substring(0, offset);

		// zwsSpan에 ZWS 추가
		const emptyText = document.createTextNode("\u200B");
		zwsSpan.appendChild(emptyText);

		// nextInline에 ZWS 추가
		const nextEmptyText = document.createTextNode("\u200B");
		nextInline.appendChild(nextEmptyText);

		if (afterText.length > 0) {
			const newTextNode = document.createTextNode(afterText);
			nextInline.appendChild(newTextNode);
		}

		// DOM에 삽입
		const prevSiblingElement = inline.previousElementSibling;

		if (prevSiblingElement?.tagName === "BR" && offset === 0) {
			// caret이 줄 맨 앞에 있고, 바로 앞이 br인 경우

			prevSiblingElement.after(zwsSpan, br, nextInline);
		} else {
			inline.after(br, nextInline);
		}

		// DOM 업데이트 후 caret 이동
		requestAnimationFrame(() => {
			const nextTextNode = nextInline.firstChild as Text;
			if (!nextTextNode) return; // 안전성 체크

			const newRange = document.createRange();
			newRange.setStart(nextTextNode, 1);
			newRange.collapse(true);
			selection.removeAllRanges();
			selection.addRange(newRange);
		});
		return;
	}
}

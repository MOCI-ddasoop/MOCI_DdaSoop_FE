//text box util

import { getAbsoluteOffset } from "./getAbsoluteOffset";
import { restoreCaretByOffset } from "./restoreCaretByOffset";

function createSpan(text: string) {
	const span = document.createElement("span");
	span.textContent = text;
	return span;
}

function createAnchor(url: string) {
	const a = document.createElement("a");
	a.href = url;
	a.textContent = url;
	a.classList.add("text-blue-600");
	a.target = "_blank";
	a.rel = "noopener noreferrer";

	return a;
}

export function processUrlWrap(root: HTMLDivElement) {
	const selection = window.getSelection();
	// selection 객체 만들기
	if (!selection || selection.rangeCount === 0) return;
	// selection이 없거나 rangeCount가 0(선택이 안되어있을때)

	const range = selection.getRangeAt(0);

	const absoluteOffset = getAbsoluteOffset(
		root,
		range.startContainer,
		range.startOffset,
	);
	//offset 절대위치(텍스트 기반)

	const urlRegex = /https?:\/\/[\S]+/g;

	// 모든 inline element unwrap
	const inlineElements = root.querySelectorAll("a, span");

	inlineElements.forEach((e) => {
		const text = document.createTextNode(e.textContent);
		// a 태그안의 내용 저장
		e.replaceWith(text);
		//현재 쪼개진 textNode로 url 저장되어있음 예: "https://w""ww.naver.com"
	});
	root.normalize();
	// 쪼개진 url text node 같은 range로 합치기

	// wrap
	// walker text node 순회
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const textNodes = [];
	//텍스트 노드 리스트 만들기

	let node: Text | null;
	while ((node = walker.nextNode() as Text | null)) {
		textNodes.push(node);
		//모든 노드들 순회하면서 textNodes에 추가
	}

	// textNode span / a 로 wrap, ZWS 삭제
	for (const textNode of textNodes) {
		const text = textNode.nodeValue;
		//노드의 텍스트 확인
		if (!text) continue;

		const parent = textNode.parentNode;
		if (!parent) continue;

		const matches = [...text.matchAll(urlRegex)];

		let lastIndex = 0;
		const fragment = document.createDocumentFragment();

		for (const match of matches) {
			const url = match[0];
			const index = match.index ?? 0;

			//url 이전 텍스트 span
			const before = text.slice(lastIndex, index);
			if (before) {
				fragment.appendChild(createSpan(before));
			}

			// url -> a
			fragment.appendChild(createAnchor(url));

			lastIndex = index + url.length;
		}

		const after = text.slice(lastIndex);
		if (after) fragment.appendChild(createSpan(after));

		parent.insertBefore(fragment, textNode);
		parent.removeChild(textNode);
	}

	// caret 위치 되돌리기
	restoreCaretByOffset(root, absoluteOffset);
}

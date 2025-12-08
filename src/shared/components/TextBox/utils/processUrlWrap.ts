//text box util

import { getAbsoluteOffset } from "./getAbsoluteOffset";
import { restoreCaretByOffset } from "./restoreCaretByOffset";

export function processUrlWrap(root: HTMLDivElement) {
	const selection = window.getSelection();
	// selection 객체 만들기
	if (!selection || selection.rangeCount === 0) return;
	// selection이 없거나 rangeCount가 0(선택이 안되어있을때)

	const range = selection.getRangeAt(0);

	const absoluteOffset = getAbsoluteOffset(
		root,
		range.startContainer,
		range.startOffset
	);
	//offset 절대위치(텍스트 기반)

	const urlRegex = /https?:\/\/[\S]+/g;

	// 모든 url의 <a> unwrap
	const anchors = root.querySelectorAll("a");
	// 모든 a 태그를 찾음
	anchors.forEach((a) => {
		const text = document.createTextNode(a.textContent);
		// a 태그안의 내용 저장
		a.replaceWith(text);
		//현재 쪼개진 textNode로 url 저장되어있음 예: "https://w""ww.naver.com"
	});
	root.normalize();
	// 쪼개진 url text node 같은 range로 합치기

	// a wrap
	// walker text node 순회
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const textNodes = [];
	//텍스트 노드 리스트 만들기

	let node: Text | null;
	while ((node = walker.nextNode() as Text | null)) {
		textNodes.push(node);
		//모든 노드들 순회하면서 textNodes에 추가
	}

	for (const textNode of textNodes) {
		const text = textNode.nodeValue;
		//노드의 텍스트 확인
		if (!text) continue;
		// console.log(text);

		const match = text.match(urlRegex);
		//노드 텍스트에 url 형식이 있는지 확인
		if (!match) continue;
		// console.log(match);

		const parent = textNode.parentNode;
		if (!parent) continue;
		if (parent instanceof HTMLAnchorElement) continue;
		//url 있는 노드가 부모가 있는지, a 태그인지 확인

		let lastIndex = 0;
		const fragments = [];

		for (const url of match) {
			const index = text.indexOf(url, lastIndex);
			if (index === -1) continue;

			const before = text.slice(lastIndex, index);
			if (before) fragments.push(before);

			const a = document.createElement("a");
			a.href = url;
			a.textContent = url;
			a.classList.add("text-blue-600");
			a.target = "_blank";
			a.rel = "noopener noreferrer";
			fragments.push(a);

			lastIndex = index + url.length;
		}

		const after = text.slice(lastIndex);
		if (after) fragments.push(after);

		for (const frag of fragments) {
			if (typeof frag === "string") {
				parent.insertBefore(document.createTextNode(frag), textNode);
			} else {
				parent.insertBefore(frag, textNode);
			}
		}
		parent.removeChild(textNode);
	}

	// caret 위치 되돌리기
	restoreCaretByOffset(root, absoluteOffset);
}

//text box util

export function getCurrentBlock(root: HTMLDivElement, selection: Selection) {
	// 새로 만들어진 블록 찾기
	let node: Node | null = selection.anchorNode;
	while (node && node !== root) {
		if (node.nodeType === 1 && (node as HTMLElement).tagName === "DIV") {
			break;
		}
		node = node.parentNode;
	}
}

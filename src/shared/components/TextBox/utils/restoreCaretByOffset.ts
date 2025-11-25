//text box util

export function restoreCaretByOffset(
	root: HTMLElement,
	absoluteOffset: number
) {
	const selection = window.getSelection();
	if (!selection) return;

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let currentOffset = 0;
	let node: Text | null;

	while ((node = walker.nextNode() as Text | null)) {
		const nodeLength = node.nodeValue?.length || 0;

		if (currentOffset + nodeLength >= absoluteOffset) {
			const range = document.createRange();
			const localOffset = absoluteOffset - currentOffset;
			range.setStart(node, Math.min(localOffset, nodeLength));
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
			return;
		}

		currentOffset += nodeLength;
	}

	//마지막 위치
	const range = document.createRange();
	range.selectNodeContents(root);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
}

//text box util
export function getAbsoluteOffset(
	root: HTMLElement,
	targetNode: Node,
	targetOffset: number
): number {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let offset = 0;
	let node;

	while ((node = walker.nextNode())) {
		//트리워커로 node 순회
		if (node === targetNode) {
			//타겟 노드에 도착하면
			return offset + targetOffset;
			//이때까지 더한 오프셋에 타겟 오프셋 더하기
		}
		offset += node.nodeValue?.length || 0;
		//오프셋은 노드의 길이를 누적계산함===순수 텍스트 기반의 offset을 찾을 수 있음.
	}

	return offset;
}

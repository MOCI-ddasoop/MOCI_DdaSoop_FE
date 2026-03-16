/**
 * 불필요한 연속 br 태그 정리
 * <br><br> 처럼 사이에 span/a/zws가 없는 br들을 하나로 정리
 */
export function cleanupConsecutiveBr(root: HTMLElement) {
	const brElements = Array.from(root.querySelectorAll("br"));

	for (let i = brElements.length - 1; i >= 1; i--) {
		const currentBr = brElements[i];
		const prevBr = brElements[i - 1];

		// 이전 br이 currentBr의 바로 직전 형제인지 확인
		if (prevBr.nextElementSibling === currentBr) {
			// 두 br 사이에 요소가 있는지 확인
			let hasBetweenContent = false;

			// prevBr과 currentBr 사이의 모든 노드 확인
			let node: Node | null = prevBr.nextSibling;
			while (node && node !== currentBr) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const el = node as HTMLElement;
					// span/a 태그가 있는지 확인
					if (el.tagName === "SPAN" || el.tagName === "A") {
						hasBetweenContent = true;
						break;
					}
				}
				node = node.nextSibling;
			}

			// 사이에 내용이 없으면 currentBr 제거
			if (!hasBetweenContent) {
				currentBr.remove();
			}
		}
	}
}

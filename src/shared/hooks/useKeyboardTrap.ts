import { MutableRefObject, useEffect, useRef } from "react";
import { Const } from "@/shared/constants/Const";

/**
 * @사용법   const elRef = useKeyboardTrap(); 선언 후, wrapper 엘리먼트에 ref={elRef} 추가
 * @returns {MutableRefObject<T | null>} elRef
 */
function useKeyboardTrap<T extends HTMLElement = HTMLElement>() {
	// 키보드 트랩, 포커스 트랩
	const elRef = useRef<T | null>(null);

	useEffect(() => {
		const handleFocus = (evt: KeyboardEvent) => _handleFocus(evt, elRef);

		elRef.current?.addEventListener(
			Const.EVENT_TYPE.KEYDOWN,
			handleFocus as EventListener
		);
		document.addEventListener(Const.EVENT_TYPE.KEYUP, preventEvt);
		document.addEventListener(Const.EVENT_TYPE.KEYDOWN, preventEvt);

		return () => {
			elRef.current?.removeEventListener(
				Const.EVENT_TYPE.KEYDOWN,
				handleFocus as EventListener
			);
			document.removeEventListener(Const.EVENT_TYPE.KEYUP, preventEvt);
			document.removeEventListener(Const.EVENT_TYPE.KEYDOWN, preventEvt);
		};
	}, []);

	return elRef;
}

export default useKeyboardTrap;

// funcs
/**
 * Handles focus for keyboard navigation within focusable elements.
 * @param {KeyboardEvent} evt - The keyboard event object.
 * @param {MutableRefObject<HTMLElement | null>} elRef - Reference to the HTMLElement.
 */
function _handleFocus(
	evt: KeyboardEvent,
	elRef: MutableRefObject<HTMLElement | null>
) {
	const TAB_KEY = "Tab";
	const focusableElementSelector = elRef.current?.querySelectorAll<HTMLElement>(
		'a[href]:not([disabled]), area[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, summary, details, video[controls], audio[controls], [contenteditable=""], [contenteditable="true"], [tabindex]:not([tabindex^="-"])'
	);

	if (!focusableElementSelector || !elRef.current) return;

	const firstFocusableEl = focusableElementSelector[0];
	const lastFocusableEl =
		focusableElementSelector[focusableElementSelector.length - 1];
	const isTabPressed = evt.key === TAB_KEY;

	// Tab key
	if (isTabPressed) {
		if (evt.shiftKey) {
			// Shift + Tab
			if (document.activeElement !== firstFocusableEl) return;
			lastFocusableEl?.focus();
			evt.preventDefault();
		} else {
			// Tab
			if (document.activeElement !== lastFocusableEl) return;
			firstFocusableEl.focus();
			evt.preventDefault();
		}
	}
}
function preventEvt(evt: Event) {
	// 다른 컴포넌트에서 입력된 이벤트를 막기 위해 사용
	evt.stopPropagation();
	evt.stopImmediatePropagation();
}

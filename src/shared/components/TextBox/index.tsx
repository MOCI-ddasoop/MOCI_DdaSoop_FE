"use client";

import { processUrlWrap } from "./utils/processUrlWrap";
import tw from "@/shared/utils/tw";
import {
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import DOMPurify from "dompurify";
import { handleEnterKeydown } from "./utils/handleEnterKeydown";
import { normalizeZWS } from "./utils/normalizeZWS";
import { cleanupConsecutiveBr } from "./utils/cleanupConsecutiveBr";
import { handleBackspaceKeydown } from "./utils/handleBackspaceKeydown";

export type TextBoxHandle = {
	getHTML: () => string;
	clear: () => void;
	focus: () => void;
};

type TextBoxType = React.HTMLAttributes<HTMLDivElement> & {
	ref?: React.RefObject<TextBoxHandle | null>;
	mode?: "default" | "comment";
	isAble?: boolean;
	className?: string;
	placeholder?: string | Element;
	initialValue?: string;
	setValue?: (value: string) => void;
};

function TextBox({
	ref: outRef,
	mode = "default",
	isAble = true,
	className,
	placeholder,
	initialValue,
	hidden,
	setValue,
}: TextBoxType) {
	const textBoxRef = useRef<HTMLDivElement>(null);
	const [isComposing, setIsComposing] = useState(false);

	const makeCleanHTML = (html: string) => {
		return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
	};

	const getHTML = useCallback(() => {
		if (!textBoxRef.current) return "";
		const raw = textBoxRef.current.innerHTML;
		return makeCleanHTML(raw);
	}, []);

	const clear = useCallback(() => {
		if (!textBoxRef.current) return;
		textBoxRef.current.innerHTML = "";
	}, []);

	const focus = useCallback(() => {
		textBoxRef.current?.focus();
	}, []);

	useImperativeHandle(outRef, () => ({
		getHTML,
		clear,
		focus,
	}));

	useEffect(() => {
		if (
			textBoxRef.current &&
			initialValue &&
			textBoxRef.current.innerHTML !== initialValue
		) {
			textBoxRef.current.innerHTML = initialValue;
		}
	}, [initialValue]);

	const processWrapCallback = useCallback(() => {
		const root = textBoxRef.current;
		//text박스 안의 HTML
		if (!root) return;
		//root가 없다면 스톱
		processUrlWrap(root);
		normalizeZWS(root);
		cleanupConsecutiveBr(root);
	}, []);

	// 키다운 이벤트 enter 의도 판단
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const root = textBoxRef.current;
		if (!root) return;
		if (isComposing) return;

		if (e.key === "Backspace") {
			handleBackspaceKeydown(e);
			requestAnimationFrame(() => {
				processWrapCallback();
			});
			return;
		}

		if (e.key !== "Enter") return;

		const isMac = navigator.platform.toUpperCase().includes("MAC");
		const isCommentEnter = isMac ? e.metaKey : e.ctrlKey;

		if (mode === "comment") {
			if (!isCommentEnter) {
				e.preventDefault();
				return;
			}

			e.preventDefault();
			handleEnterKeydown();
			requestAnimationFrame(() => {
				processWrapCallback();
			});
			return;
		}

		e.preventDefault();
		handleEnterKeydown();
		requestAnimationFrame(() => {
			processWrapCallback();
		});
	};

	// DOM 후처리
	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const root = textBoxRef.current;
		if (!root) return;

		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const inputType = (e.nativeEvent as InputEvent).inputType;

		if (inputType === "deleteContentBackward") {
			if (root.innerText.trim() === "") {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (root.innerText.trim() === "") {
							root.innerHTML = "";
						}
					});
				});
			}

			processWrapCallback();
			return;
		}
		// 영어 입력 지연처리
		if (inputType === "insertText") {
			if (isComposing) return;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					processWrapCallback();
				});
			});
		} else {
			// 기타 inputType 처리
			if (isComposing) return;
			processWrapCallback();
		}
	};

	return (
		<div
			ref={textBoxRef}
			className={tw([
				"w-full min-h-6 overflow-auto focus:outline-none",
				"placeholder-style",
				className,
			])}
			hidden={hidden}
			data-placeholder={placeholder}
			onKeyDown={handleKeyDown}
			onInput={handleInput}
			contentEditable={isAble && "plaintext-only"}
			onCompositionStart={() => setIsComposing(true)}
			onCompositionEnd={() => {
				setIsComposing(false);
				processWrapCallback();
			}}
		/>
	);
}
export default TextBox;

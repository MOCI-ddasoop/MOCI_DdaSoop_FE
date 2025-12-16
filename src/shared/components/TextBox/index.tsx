"use client";

import { getCurrentBlock } from "./utils/getCurrentBlock";
import { processUrlWrap } from "./utils/processUrlWrap";
import tw from "@/shared/utils/tw";
import { useCallback, useRef, useState } from "react";
import DOMPurify from "dompurify";

type TextBoxType = React.HTMLAttributes<HTMLDivElement> & {
	isAble?: boolean;
	className?: string;
	placeholder?: string | Element;
	setValue?: (value: string) => void;
};

function TextBox({
	isAble = true,
	className,
	placeholder,
	setValue,
	hidden,
}: TextBoxType) {
	const textBoxRef = useRef<HTMLDivElement>(null);
	const [isComposing, setIsComposing] = useState(false);

	const makeCleanHTML = (html: string) => {
		return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
	};

	const processWrapCallback = useCallback(() => {
		const root = textBoxRef.current;
		//text박스 안의 HTML
		if (!root) return;
		//root가 없다면 스톱
		processUrlWrap(root);
	}, []);

	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const root = textBoxRef.current;
		if (!root) return;

		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const inputType = (e.nativeEvent as InputEvent).inputType;

		if (inputType === "insertParagraph") {
			if (isComposing) return;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					getCurrentBlock(root, selection);
<<<<<<< HEAD
					if (setValue) setValue(makeCleanHTML(root.innerHTML));
=======
					if (setValue) setValue(root.innerHTML);
>>>>>>> origin
				});
			});
			return;
		}
		if (isComposing) {
<<<<<<< HEAD
			if (setValue) setValue(makeCleanHTML(root.innerHTML));
=======
			if (setValue) setValue(root.innerHTML);
>>>>>>> origin
			return;
		}
		if (inputType === "deleteContentBackward") {
			if (root.innerText.trim() === "") {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						// 1) 빈 block(div)을 제거
						Array.from(root.children).forEach((child) => {
							const el = child as HTMLElement;
							if (el.tagName === "DIV" && el.innerText.trim() === "") {
								child.remove();
							}
						});

						// 2) 루트가 실제로 비었으면 완전히 초기화
						if (root.innerText.trim() === "") {
							root.innerHTML = "";
						}
<<<<<<< HEAD
						if (setValue) setValue(makeCleanHTML(root.innerHTML));
=======
						if (setValue) setValue(root.innerHTML);
>>>>>>> origin
					});
				});
			}
			return;
		}
		// 영어 입력 지연처리
		if (inputType === "insertText") {
<<<<<<< HEAD
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					processWrapCallback();
					if (setValue) setValue(makeCleanHTML(root.innerHTML));
				});
			});
		} else {
			// 기타 inputType 처리
			processWrapCallback();
			if (setValue) setValue(makeCleanHTML(root.innerHTML));
=======
			if (!pendingRef.current) {
				pendingRef.current = true;
				requestAnimationFrame(() => {
					pendingRef.current = false;
					processWrapCallback();
				});
				if (setValue) setValue(root.innerHTML);
			}
		} else {
			// 기타 inputType 처리
			processWrapCallback();
			if (setValue) setValue(root.innerHTML);
>>>>>>> origin
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
<<<<<<< HEAD
			hidden={hidden}
			data-placeholder={placeholder}
			onInput={handleInput}
			contentEditable={isAble && "plaintext-only"}
=======
			data-placeholder={placeholder}
			onInput={handleInput}
			contentEditable="true"
>>>>>>> origin
			onCompositionStart={() => setIsComposing(true)}
			onCompositionEnd={() => {
				setIsComposing(false);
				processWrapCallback();
			}}
		/>
	);
}
export default TextBox;

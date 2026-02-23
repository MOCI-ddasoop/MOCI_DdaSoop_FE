"use client";

import { useEffect, useRef, useState } from "react";

interface TagInputProps {
	initialValue?: string[];
	onTagChanged: (tags: string[]) => void;
	maxTags?: number;
	maxTagLength?: number;
}

function TagInput({
	initialValue,
	onTagChanged,
	maxTags = 5,
	maxTagLength = 15,
}: TagInputProps) {
	const TAG_WARNING = {
		MAX_TAG: `태그는 ${maxTags}개까지 입력할 수 있습니다`,
		DUPLICATE: "이미 추가된 태그입니다",
		MAX_LENGTH: `태그는 최대 ${maxTagLength}자까지 입력가능합니다`,
		NOT_ALLOWED: "특수문자는 _ 만 허용됩니다",
	};

	const [tags, setTags] = useState<string[]>(initialValue ?? []); // 태그목록
	const [input, setInput] = useState(""); // 현재 input
	const [warning, setWarning] = useState(""); // 경고+알림

	const [isComposing, setIsComposing] = useState(false); // 단어조합
	const focusRef = useRef<HTMLInputElement>(null);

	const [isFocused, setIsFocused] = useState(false);

	// 태그업데이트(부모);
	useEffect(() => {
		onTagChanged(tags);
	}, [tags, onTagChanged]);

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = (
		e: React.CompositionEvent<HTMLInputElement>,
	) => {
		setIsComposing(false);
		const value = e.currentTarget.value.trim();

		if (value.length > maxTagLength) {
			setWarning(TAG_WARNING.MAX_LENGTH);
			setInput(value.slice(0, maxTagLength));
			return;
		}
		setInput(value);
	};

	const addTag = (value: string) => {
		const newTag = value.replace(/\s+/g, "").trim();
		if (!newTag) return;

		if (tags.includes(newTag)) {
			setWarning(TAG_WARNING.DUPLICATE);
			setInput("");
			return;
		}

		if (tags.length >= maxTags) {
			return setWarning(TAG_WARNING.MAX_TAG);
		}

		setTags((prev) => [...prev, newTag]);
		if (warning) setWarning("");
		setInput("");
	};

	// const handleSubmit = (
	//   e:
	//     | React.FormEvent<HTMLFormElement>
	//     | React.KeyboardEvent<HTMLInputElement>
	//     | React.FocusEvent<HTMLInputElement>
	// ) => {
	//   e.preventDefault();

	//   const newTag = input.trim();
	//   if (!newTag) return;

	//   if (tags.includes(newTag)) {
	//     setWarning(TAG_WARNING.DUPLICATE);
	//     setInput("");
	//     return;
	//   }
	//   setWarning("");
	//   setTags([...tags, newTag]);
	//   setInput("");
	// };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value;

		let filtered = [...value]
			.filter((c) => /^[0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ_]$/.test(c))
			.join("");

		if (filtered !== value) {
			e.preventDefault();
			setWarning(TAG_WARNING.NOT_ALLOWED);
		} else {
			if (warning === TAG_WARNING.NOT_ALLOWED) setWarning("");
		}

		setInput((prev) => {
			const next = prev + filtered;
			return next.slice(0, maxTagLength);
		});

		if (isComposing) {
			setInput(filtered);
			return;
		}

		if (filtered.length > maxTagLength) {
			setWarning(TAG_WARNING.MAX_LENGTH);
			filtered = filtered.slice(0, maxTagLength);
			setInput(filtered);
			return;
		}
		if (warning === TAG_WARNING.MAX_LENGTH) setWarning("");
		setInput(filtered);
	};

	const removeTag = (index: number) => {
		setTags((prev) => prev.filter((_, i) => i !== index));
		setWarning("");
		setIsFocused(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// 엔터나 스페이스 -> 태그만들기
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (isComposing) {
				setIsComposing(false);
			}
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					addTag(input);
				});
			});
			return;
		}

		// const isAllowed = /^[0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ_]$/.test(e.key);

		// // 특수문자 금지
		// if (e.key.length === 1 && !isAllowed) {
		// 	e.preventDefault();
		// 	setWarning(TAG_WARNING.NOT_ALLOWED);
		// 	return;
		// }

		// 입력값 없을 때 backspace → 태그 삭제
		if (e.key === "Backspace" && input === "" && tags.length > 0) {
			setTags((prev) => prev.slice(0, -1));
			if (warning) setWarning("");
		}
	};

	// const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
	// 	const pasteText = e.clipboardData.getData("text");

	// 	const filtered = [...pasteText]
	// 		.filter((c) => /^[0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ_]$/.test(c))
	// 		.join("");

	// 	if (filtered !== pasteText) {
	// 		e.preventDefault();
	// 		setWarning(TAG_WARNING.NOT_ALLOWED);
	// 	} else {
	// 		if (warning) setWarning("");
	// 	}

	// 	setInput((prev) => {
	// 		const next = prev + filtered;
	// 		return next.slice(0, maxTagLength);
	// 	});
	// };

	return (
		<>
			{warning ? (
				<p className="text-mainred text-sm self-baseline px-2">{warning}</p>
			) : (
				<p className="text-gray-400 text-sm self-baseline px-2">
					{tags.length > 0
						? `${
								tags.length >= maxTags ? TAG_WARNING.MAX_TAG : ""
							} 작성한 태그를 누르면 삭제됩니다`
						: ""}
				</p>
			)}
			<div className="w-full p-2 border-t border-pastelblue focus:outline-none placeholder-style">
				<ul className="w-full flex gap-1 flex-wrap">
					{tags.map((tag, i) => (
						<li
							onClick={(e) => {
								e.stopPropagation();
								removeTag(i);
							}}
							key={i}
							className="w-fit text-mainblue select-none"
						>
							#{tag}
						</li>
					))}

					{tags.length < maxTags && (
						<li className={`${!input ? "flex-1" : ""} relative min-w-10`}>
							<label htmlFor="tag" className="w-full flex">
								{tags.length < maxTags && (
									<span className={`${!isFocused && "hidden"}`}>#</span>
								)}
								<input
									ref={focusRef}
									className={`${
										input ? "field-sizing-content" : "w-full"
									} focus:outline-none min-w-10 placeholder:text-gray-400`}
									type="text"
									name="tag"
									id="tag"
									placeholder={
										tags.length === 0
											? `태그입력(${maxTagLength}자 이내, ${maxTags}개 제한)`
											: tags.length < maxTags
												? isFocused
													? "태그"
													: "#태그"
												: ""
									}
									value={input}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
									onCompositionStart={handleCompositionStart}
									onCompositionEnd={handleCompositionEnd}
									disabled={tags.length >= maxTags}
									// onPaste={handlePaste}
									onFocus={() => setIsFocused(true)}
									onBlur={() => {
										setIsFocused(false);
										requestAnimationFrame(() => {
											if (!isComposing && tags.length < maxTags) addTag(input);
										});
									}} // focus해제되면 입력하던거 태그로 만들기
								/>
							</label>
						</li>
					)}
				</ul>
			</div>
		</>
	);
}

export default TagInput;

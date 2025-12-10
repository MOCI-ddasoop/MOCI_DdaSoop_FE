"use client";

import { useEffect, useRef, useState } from "react";

interface TagInputProps {
  onTagChanged: (tags: string[]) => void;
  maxTags?: number;
  maxTagLength?: number;
}

function TagInput({
  onTagChanged,
  maxTags = 5,
  maxTagLength = 15,
}: TagInputProps) {
  const TAG_WARNING = {
    MAX_TAG: `태그는 ${maxTags}개까지 입력할 수 있습니다`,
    DUPLICATE: "이미 추가된 태그입니다",
    MAX_LENGTH: `태그는 최대 ${maxTagLength}자까지 입력가능합니다`,
    HASH: "#은 자동으로 추가됩니다",
  };

  // 스페이스바나 엔터 누르면 태그 생성
  // 백스페이스 누르면 태그 전체 삭제
  // 태그 누르면 수정가능
  const [tags, setTags] = useState<string[]>([]); // 태그목록
  const [input, setInput] = useState(""); // 현재 input
  const [warning, setWarning] = useState(""); // 경고+알림
  const [isComposing, setIsComposing] = useState(false); // 단어조합

  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 수정중인태그index

  // 인풋 width 조절하기위해서 span 잡는거
  // const mirrorRef = useRef<HTMLSpanElement>(null);
  // const newMirrorRef = useRef<HTMLSpanElement>(null);

  // 인풋 focus하려고 잡는거
  const newInputRef = useRef<HTMLInputElement>(null);

  // 태그업데이트(부모)
  useEffect(() => {
    onTagChanged(tags);
  }, [tags, onTagChanged]);

  // 태그 개수제한 내인경우 태그수정 종료되면 새 태그생성하는 input에 focus
  useEffect(() => {
    if (editingIndex === null && newInputRef.current && tags.length < maxTags) {
      requestAnimationFrame(() => newInputRef.current?.focus());
    }
  }, [editingIndex, maxTags, tags.length]);

  const startEdit = (index: number, e: React.MouseEvent<HTMLLIElement>) => {
    if (editingIndex !== null && editingIndex !== index) {
      applyEdit(); // 현재 편집 내용 저장
    }
    setEditingIndex(index);
    setInput(tags[index]); // 기존 태그 -> input에 넣기
  };

  const applyEdit = () => {
    const newTag = input.trim();
    if (!newTag) {
      // 입력한 텍스트 없으면 태그 삭제
      setTags((prev) => prev.filter((_, idx) => idx !== editingIndex));
      finishEdit();
      return;
    }
    if (tags.includes(newTag) && tags[editingIndex!] !== newTag) {
      setWarning(TAG_WARNING.DUPLICATE);
      return;
    }
    setTags((prev) =>
      prev.map((tag, i) => (i === editingIndex ? newTag : tag))
    );
    finishEdit();
  };

  const finishEdit = () => {
    setEditingIndex(null);
    setInput("");
    setWarning("");
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    const value = e.currentTarget.value.slice(0, 15);
    setInput(value);
    if (value.length === maxTagLength) {
      setWarning(TAG_WARNING.MAX_LENGTH);
    }
  };

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const newTag = input.trim();
    if (!newTag) return;

    if (tags.length === maxTags) {
      setWarning(TAG_WARNING.MAX_TAG);
      setInput("");
      return;
    }

    if (tags.includes(newTag)) {
      setWarning(TAG_WARNING.DUPLICATE);
      setInput("");
      return;
    }
    setWarning("");
    setTags([...tags, newTag]);
    setInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isComposing) {
      setInput(value);
      return;
    }
    if (value.length > maxTagLength) {
      setWarning(TAG_WARNING.MAX_LENGTH);
      setInput(e.target.value.slice(0, maxTagLength));
    } else {
      if (warning) setWarning("");
      setInput(value);
    }
  };

  // const removeTag = (index: number) => {
  //   setTags((prev) => prev.filter((_, i) => i !== index));
  //   setWarning("");
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return; // IME 중에는 무시

    // # 금지
    if (e.key === "#") {
      e.preventDefault();
      setWarning(TAG_WARNING.HASH);
    }
    if (editingIndex !== null) {
      // 태그수정중에 엔터나 스페이스 -> 태그수정완료
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        applyEdit();
      }
      // 태그수정중에 esc 누르면 태그수정취소
      if (e.key === "Escape") finishEdit();

      if (e.key === "Backspace" && input === "") {
        // 빈 상태에서 backspace → 삭제
        setTags((prev) => prev.filter((_, i) => i !== editingIndex));
        finishEdit();
      }
      return;
    }

    // 엔터나 스페이스 -> 태그만들기
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSubmit(e);
    }

    // 입력값 없을 때 backspace → 태그 삭제
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, prev.length - 1));
      setWarning("");
    }
  };

  return (
    <>
      <div className="w-full p-2 border-t border-pastelblue focus:outline-none placeholder-style">
        <ul className="w-full flex gap-0.5 flex-wrap">
          {tags.map((tag, i) =>
            // 해당태그를 수정중인경우 해당태그가 value로 있는 input 보여주기
            // 아니면 그냥 태그
            editingIndex === i ? (
              <label
                key={i}
                htmlFor="tagEdit"
                className="relative inline-flex items-center px-1"
              >
                <input
                  key={i}
                  type="text"
                  id="tagEdit"
                  name="tagEdit"
                  className="focus:outline-none field-sizing-content min-w-1 placeholder:text-gray-400"
                  value={input}
                  autoFocus
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  // style={{ width: inputWidth }}
                />
              </label>
            ) : (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(i, e);
                }}
                key={i}
                className="w-fit text-mainblue select-none"
              >
                #{tag}
              </li>
            )
          )}
          {/* 수정중이지 않은 경우에는 새 태그 입력하는 input 나오게 */}
          {editingIndex === null && (
            <li className={`${!input ? "flex-1" : ""} relative min-w-2`}>
              <form className="w-full" onSubmit={handleSubmit}>
                <label htmlFor="tag" className="w-full flex">
                  <input
                    ref={newInputRef}
                    className={`${
                      input ? "field-sizing-content" : "w-full"
                    } focus:outline-none min-w-1 placeholder:text-gray-400`}
                    type="text"
                    name="tag"
                    id="tag"
                    placeholder={tags.length === 0 ? "#태그" : ""}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onBlur={handleSubmit}
                    // style={{ width: input ? inputWidth : undefined }}
                  />
                </label>
              </form>
            </li>
          )}
        </ul>
      </div>
      {warning ? (
        <p className="text-mainred text-sm self-baseline px-2">{warning}</p>
      ) : (
        <p className="text-gray-400 text-sm self-baseline px-2">
          {tags.length > 0 && "태그 클릭 시 수정, backspace로 삭제 가능"}
        </p>
      )}
    </>
  );
}

export default TagInput;

"use client";
import Button from "@/shared/components/Button";
import { useRef, useState } from "react";

function DonateNews() {
  const isCreator = true;
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight;

    if (newHeight > 424) {
      textarea.style.height = "424px";
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = "hidden";
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
    });
  };

  const handleSubmit = () => {
    // 소식올리는 api -
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {isCreator && !isEditing && (
        <Button color="red" className="w-60" onClick={() => setIsEditing(true)}>
          작성하기
        </Button>
      )}
      {isEditing && (
        <>
          <div className="w-full">
            <label htmlFor="donateNews">
              <textarea
                ref={textareaRef}
                name="donateNews"
                id="donateNews"
                onInput={handleInput}
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 overflow-hidden focus:outline-pastelred min-h-15 max-h-106"
                placeholder="후원 관련 소식과 후원금 사용 내역을 작성해주세요"
              />
            </label>
          </div>
          <Button className="w-60" color="red" onClick={handleSubmit}>
            작성하기
          </Button>
        </>
      )}
      {/* <p className="w-full">공지내용</p> */}
    </div>
  );
}

export default DonateNews;

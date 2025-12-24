"use client";

import { createPortal } from "react-dom";
import reportModalStore from "./stores/reportModalStore";
import Button from "@/shared/components/Button";
import { useEffect, useId } from "react";
import CommentItem from "../comment/components/CommentItem";

function ReportModal() {
  const isOpen = reportModalStore((state) => state.isOpen);
  const setIsOpen = reportModalStore((state) => state.setIsOpen);
  const isClient = typeof window !== "undefined";
  const textareaId = useId();

  // 여기서 캐싱된 데이터를 리로드하거나 데이터를 store로 넘겨받아 렌더링.

  useEffect(() => {
    if (!isOpen) return;

    // ESC 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isClient) return null;

  return createPortal(
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-100 flex items-center justify-center backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute flex flex-col gap-4 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-2 w-1/4 ">
          <h2 className="text-center text-2xl font-semibold text-slate-700">
            신고하기
          </h2>
          <div>
            <div className="font-semibold text-slate-700">신고할 게시물</div>
            <CommentItem
              profileImage="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006"
              author="맹구"
              date="2024-06-12"
              content="신고할거에요?"
            />
          </div>
          <form action="">
            <label
              htmlFor={textareaId}
              className="font-semibold text-slate-700"
            >
              신고사유
            </label>
            <textarea
              rows={5}
              className="w-full resize-none p-2 outline outline-gray-200 rounded-md"
            />
            <Button color="red" className="w-full">
              신고하기
            </Button>
          </form>
        </div>
      </div>
    ),
    document.body
  );
}
export default ReportModal;

"use client";

import { createPortal } from "react-dom";
import reportModalStore from "./stores/reportModalStore";
import Button from "@/shared/components/Button";
import { useId } from "react";

function ReportModal() {
  const isOpen = reportModalStore((state) => state.isOpen);
  const isClient = typeof window !== "undefined";
  const textareaId = useId();

  if (!isClient) return null;

  return createPortal(
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-100 flex items-center justify-center backdrop-blur-sm">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-2 w-1/4">
          <h2 className="text-center text-2xl font-semibold text-slate-700">
            신고하기
          </h2>
          <form action="">
            <label htmlFor={textareaId}>신고사유</label>
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

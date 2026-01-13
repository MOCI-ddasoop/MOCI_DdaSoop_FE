"use client";
import { readAllNotification } from "../api/readAllNotification";
import { AiOutlineCheckCircle } from "react-icons/ai";

function ReadAllButton() {
  return (
    <button
      type="button"
      className="flex-center flex-col gap-1 shrink-0 cursor-pointer group"
      onClick={readAllNotification}
    >
      <AiOutlineCheckCircle
        size={24}
        className="w-full group-hover:text-mainblue"
      />
      <p className="group-hover:text-mainblue">전체읽음처리</p>
    </button>
  );
}

export default ReadAllButton;

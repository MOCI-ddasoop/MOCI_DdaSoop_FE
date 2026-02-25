"use client";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useReadAllNotification } from "../api/useReadAllNotification";
import { ConfirmAlert } from "@/shared/utils/alert";

function ReadAllButton({ isEmpty }: { isEmpty: boolean }) {
  const { mutate: readAllNotification } = useReadAllNotification();
  const handleReadAll = () => {
    ConfirmAlert({
      text: "모든 알림을 읽음처리하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        readAllNotification();
      }
    });
  };
  return (
    <button
      type="button"
      className="flex-center shrink-0 cursor-pointer group  p-1 gap-1"
      onClick={handleReadAll}
      disabled={isEmpty}
    >
      <p className={!isEmpty ? "group-hover:text-mainblue" : "text-gray-500"}>
        전체읽음처리
      </p>
      <AiOutlineCheckCircle
        size={24}
        className={!isEmpty ? "group-hover:text-mainblue" : "text-gray-500"}
      />
    </button>
  );
}

export default ReadAllButton;

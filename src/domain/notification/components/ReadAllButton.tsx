"use client";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useReadAllNotification } from "../api/useReadAllNotification";
import Swal from "sweetalert2";

function ReadAllButton() {
  const { mutate: readAllNotification } = useReadAllNotification();
  const handleReadAll = () => {
    Swal.fire({
      title: "알림",
      text: "모든 알림을 읽음처리하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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
      className="flex-center flex-col gap-1 shrink-0 cursor-pointer group"
      onClick={handleReadAll}
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

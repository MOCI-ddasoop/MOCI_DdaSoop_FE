"use client";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { useDeleteReadNotification } from "../api/useDeleteReadNotification.ts";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

function DeleteReadButton() {
  const qc = useQueryClient();
  const { mutate: deleteReadNotification } = useDeleteReadNotification({
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.list("ALL"),
      });
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.recent,
      });
    },
  });
  const handleDeleteRead = () => {
    Swal.fire({
      title: "알림",
      text: "읽은 알림을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReadNotification();
      }
    });
  };
  return (
    <button
      type="button"
      className="flex-center shrink-0 cursor-pointer group p-1 gap-1"
      onClick={handleDeleteRead}
    >
      <p className="group-hover:text-mainred">읽은알림삭제</p>
      <AiOutlineDelete size={24} className="group-hover:text-mainred" />
    </button>
  );
}

export default DeleteReadButton;

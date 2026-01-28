"use client";
import React from "react";
import Image from "next/image";
import Button from "@/shared/components/Button";
import tw from "@/shared/utils/tw";
import { useAuthStore } from "@/store/authStore";
import { useGetMyCounts } from "../api/useGetMyCounts";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { deleteUser } from "../api/deleteUser";
import { AxiosError } from "axios";

function UserInfo({ className }: { className?: string }) {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const {data:counts} = useGetMyCounts();
  if (!me) return null;

  const handleLogout = async () => {
    const result = await Swal.fire({
      text:"로그아웃 하시겠습니까?",
      icon:"question",
      iconColor:"var(--color-mainblue)",
      showCancelButton:true,
      confirmButtonText:"예",
      confirmButtonColor:"var(--color-mainblue)",
      cancelButtonColor:"var(--color-gray)",
      cancelButtonText:"취소",
    })
    if (!result.isConfirmed) return;

    try{
      await logout();
      Swal.fire("완료","로그아웃 되었습니다.","success");
    }catch{
      Swal.fire("실패","로그아웃에 실패했습니다.","error");
    }
    router.push("/");
  }

  const handleDeleteUser = async () => {
    const result = await Swal.fire({
      title:"정말 회원 탈퇴하시겠습니까?",
      text:"탈퇴하시면 모든 정보가 삭제되며 복구가 불가능합니다",
      icon:"warning",
      iconColor:"var(--color-mainred)",
      confirmButtonColor:"var(--color-mainred)",
      cancelButtonColor:"var(--color-gray)",
      confirmButtonText:"탈퇴",
      cancelButtonText:"취소",
      showCancelButton:true,
    })
    if (!result.isConfirmed) return;

    try{
      await deleteUser();
      Swal.fire("완료","회원탈퇴 되었습니다.","success");
      logout();
      router.push("/");
    }catch(error){
      const err = error as AxiosError<{message:string}>;
      const message = err.response?.data?.message ?? "회원탈퇴에 실패했습니다.";

      Swal.fire("실패",message,"error");
    }
  };

  return (
    <div className={tw("w-full h-full flex gap-10 items-center justify-center", className)}>
      <div className="w-40 h-40 relative rounded-full bg-gray-100">
        <Image
          src={me.profileImageUrl}
          alt="profile image"
          fill
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="w-full h-full flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-4 ">
          <p className="text-2xl font-bold">{me.nickname}</p>
          <button
            type="button"
            onClick={()=>router.push("/mypage/edit")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-mainblue cursor-pointer transition"
          >
            <FiEdit2 className="text-sm"/>
            <span>내 정보 수정</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">{me.email}</p>
        <ul className="flex gap-2">
          <li className="pr-2 border-r border-gray-300">
            좋아요{" "}
            <span className="text-mainblue font-semibold">
              {counts?.likedCount}
            </span>
          </li>
          <li className="px-2 border-r border-gray-300">
            댓글{" "}
            <span className="text-mainblue font-semibold">
              {counts?.commentedCount}
            </span>
          </li>
          <li>
            피드{" "}
            <span className="text-mainblue font-semibold">
              {counts?.feedCount}
            </span>
          </li>
        </ul>
        <div className="flex justify-between items-center">
          <Button color="skyblue" size="sm" onClick={handleLogout}>로그아웃</Button>
          <button className="text-gray-500 hover:text-mainblue cursor-pointer underline" onClick={handleDeleteUser}>
            <span>회원탈퇴</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
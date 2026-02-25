"use client";
import React from "react";
import Image from "next/image";
import Button from "@/shared/components/Button";
import tw from "@/shared/utils/tw";
import { useAuthStore } from "@/store/authStore";
import { useGetMyCounts } from "../api/useGetMyCounts";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { deleteUser } from "../api/deleteUser";
import { AxiosError } from "axios";
import { Alert, ConfirmAlert, TextInputAlert } from "@/shared/utils/alert";

function UserInfo({ className }: { className?: string }) {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const { data: counts } = useGetMyCounts();
  if (!me) return null;

  const handleLogout = async () => {
    const result = await ConfirmAlert({
      text: "로그아웃 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "취소",
    });
    if (!result.isConfirmed) return;

    try {
      await logout();
      Alert({
        text: "로그아웃 되었습니다.",
        timer: 1500,
      });
      router.push("/");
    } catch {
      Alert({
        text: "로그아웃에 실패했습니다.",
        timer: 1500,
      });
    }
  };

  const handleDeleteUser = async () => {
    const result = await ConfirmAlert({
      text: "정말 회원탈퇴 하시겠습니까?",
      confirmButtonText: "탈퇴",
      cancelButtonText: "취소",
      showCancelButton: true,
      red: true,
    });
    if (!result.isConfirmed) return;

    const reason = await TextInputAlert({
      title: "탈퇴 사유를 입력해주세요",
      inputPlaceholder: "탈퇴 사유를 입력해주세요",
      showCancelButton: true,
      confirmButtonText: "탈퇴완료",
      cancelButtonText: "취소",
      red: true,
      validMessage: "탈퇴 사유는 반드시 입력해야 합니다.",
    });
    if (!reason.isConfirmed) return;

    try {
      await deleteUser({ reason: reason.value });
      await Alert({
        text: "회원탈퇴가 완료되었습니다.",
        timer: 1500,
        red: true,
      });
      logout();
      router.push("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message ?? "회원탈퇴에 실패했습니다.";

      Alert({
        text: message,
        timer: 1500,
      });
    }
  };

  return (
    <div
      className={tw(
        "w-full h-full flex gap-10 items-center justify-center",
        className,
      )}
    >
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
            onClick={() => router.push("/mypage/edit")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-mainblue cursor-pointer transition"
          >
            <FiEdit2 className="text-sm" />
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
          <Button color="skyblue" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
          <button
            className="text-gray-500 hover:text-mainblue cursor-pointer underline"
            onClick={handleDeleteUser}
          >
            <span>회원탈퇴</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

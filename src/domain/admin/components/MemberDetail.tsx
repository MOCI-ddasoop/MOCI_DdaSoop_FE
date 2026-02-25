"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdminMember } from "../api/useAdminMember";
import { putAdminMemberRole } from "../api/putAdminMemberRole";
import { deleteAdminMember } from "../api/deleteAdminMember";
import { putAdminMemberRestore } from "../api/putAdminMemberRestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/shared/components/Button";
import { ADMIN_MEMBERS_QUERY_KEY } from "../api/useAdminMembers";
import Swal from "sweetalert2";
import tw from "@/shared/utils/tw";

type MemberDetailProps = {
  memberId: number;
};

export default function MemberDetail({ memberId }: MemberDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: member, isPending, isError } = useAdminMember(memberId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_MEMBERS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["admin", "members", memberId] });
  };

  const roleMutation = useMutation({
    mutationFn: ({ role }: { role: "USER" | "ADMIN" }) =>
      putAdminMemberRole(memberId, role),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "역할이 변경되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "역할 변경에 실패했습니다.", "error"),
  });

  const withdrawMutation = useMutation({
    mutationFn: () => deleteAdminMember(memberId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "탈퇴 처리되었습니다.", "success");
      router.refresh();
    },
    onError: () => Swal.fire("실패", "탈퇴 처리에 실패했습니다.", "error"),
  });

  const restoreMutation = useMutation({
    mutationFn: () => putAdminMemberRestore(memberId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "복구되었습니다.", "success");
      router.refresh();
    },
    onError: () => Swal.fire("실패", "복구에 실패했습니다.", "error"),
  });

  const handleRoleChange = (role: "USER" | "ADMIN") => {
    Swal.fire({
      text: `역할을 ${role}(으)로 변경하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "변경",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) roleMutation.mutate({ role });
    });
  };

  const handleWithdraw = () => {
    Swal.fire({
      text: "해당 회원을 탈퇴 처리하시겠습니까?",
      icon: "warning",
      confirmButtonColor: "var(--color-mainred)",
      showCancelButton: true,
      confirmButtonText: "탈퇴 처리",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) withdrawMutation.mutate();
    });
  };

  const handleRestore = () => {
    Swal.fire({
      text: "해당 회원을 복구하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "복구",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) restoreMutation.mutate();
    });
  };

  if (isPending) {
    return (
      <div className="rounded-lg border border-pastelblue-border p-6">
        <p className="text-gray-500">회원 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        회원 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  const isWithdrawn = !!member.deletedAt;
  const profileSrc = member.profileImageUrl ?? "/defaultFeedImage.png";
  const isAdmin =
    member.role?.toUpperCase() === "ADMIN" ||
    member.role?.toUpperCase()?.includes("ADMIN");
  const displayMemberId = member.memberId ?? member.id ?? memberId;

  return (
    <div className="rounded-lg border border-pastelblue-border overflow-hidden">
      <div className="bg-pastelblue p-4 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-pastelblue-border">
          <Image
            src={profileSrc}
            alt={member.nickname ?? "프로필"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{member.nickname ?? "-"}</h2>
          <p className="text-sm text-gray-600">{member.email ?? "-"}</p>
          <p className="text-sm">
            회원ID: {displayMemberId} · 역할:{" "}
            <span
              className={tw(
                "font-medium",
                isAdmin ? "text-mainred" : "text-mainblue"
              )}
            >
              {member.role ?? "-"}
            </span>
          </p>
        </div>
      </div>
      <div className="p-4 space-y-2 text-sm">
        <p>
          <span className="text-gray-500">가입일:</span>{" "}
          {member.createdAt
            ? new Date(member.createdAt).toLocaleString("ko-KR")
            : "-"}
        </p>
        <p>
          <span className="text-gray-500">최종 수정:</span>{" "}
          {member.updatedAt
            ? new Date(member.updatedAt).toLocaleString("ko-KR")
            : "-"}
        </p>
        {member.deletedAt && (
          <p className="text-mainred">
            탈퇴일: {new Date(member.deletedAt).toLocaleString("ko-KR")}
          </p>
        )}
      </div>
      <div className="p-4 border-t border-pastelblue-border">
        <p className="text-sm font-semibold text-gray-700 mb-2">역할 변경</p>
        <div className="flex flex-wrap gap-2">
          {!isAdmin && (
            <Button
              size="sm"
              color="skyblue"
              onClick={() => handleRoleChange("ADMIN")}
              disabled={roleMutation.isPending}
            >
              관리자로 변경
            </Button>
          )}
          {isAdmin && (
            <Button
              size="sm"
              color="gray"
              onClick={() => handleRoleChange("USER")}
              disabled={roleMutation.isPending}
            >
              일반회원으로 변경
            </Button>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">계정 관리</p>
        <div className="flex flex-wrap gap-2">
          {!isWithdrawn && (
            <Button
              size="sm"
              color="red"
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
            >
              탈퇴 처리
            </Button>
          )}
          {isWithdrawn && (
            <Button
              size="sm"
              color="skyblue"
              onClick={handleRestore}
              disabled={restoreMutation.isPending}
            >
              복구
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

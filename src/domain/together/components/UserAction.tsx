"use client";

import FeedCreateButton from "@/domain/feed/components/FeedCreateButton";
import Button from "@/shared/components/Button";
import { useAuthStore } from "@/store/authStore";
import { useJoinTogether } from "../api/useJoinTogether";
import { useLeaveTogether } from "../api/useLeaveTogether";
import { useCheckIsMember } from "../api/useCheckIsMember";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import { Alert, ConfirmAlert } from "@/shared/utils/alert";

function UserAction({ id, recruiting }: { id: number; recruiting: boolean }) {
  const qc = useQueryClient();
  const user = useAuthStore((store) => store.me);
  const isLogin = !!user;
  const userId = user?.memberId;

  const { mutate: joinTogether } = useJoinTogether({
    onSuccess: () => {
      qc.refetchQueries({ queryKey: queryKeys.together.isParticipating() });
      qc.refetchQueries({ queryKey: queryKeys.together.id(String(id)) });
      qc.invalidateQueries({ queryKey: queryKeys.together.member(userId!) });
      Alert({ text: "참여가 완료되었습니다.", timer: 1500 });
    },
  });

  const { mutate: leaveTogether } = useLeaveTogether({
    onSuccess: async () => {
      await qc.refetchQueries({
        queryKey: queryKeys.together.isParticipating(),
      });
      await qc.refetchQueries({ queryKey: queryKeys.together.id(String(id)) });
      qc.invalidateQueries({ queryKey: queryKeys.together.member(userId!) });
      Alert({ text: "탈퇴가 완료되었습니다.", timer: 1500, red: true });
    },
  });

  const { data, isError, isPending } = useCheckIsMember({
    togetherId: id,
    userId,
    isLogin,
  });

  const isMember = data ? data.data : false;

  const handleJoinParticipate = () => {
    if (!isLogin) {
      Alert({ text: "로그인이 필요합니다.", timer: 1500 });
      return;
    } else {
      ConfirmAlert({
        text: "함께하기에 참여하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "참여",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) joinTogether(id);
      });
    }
  };

  const handleLeaveParticipate = () => {
    ConfirmAlert({
      text: "함께하기를 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴",
      cancelButtonText: "취소",
      red: true,
    }).then((result) => {
      if (result.isConfirmed) leaveTogether(id);
    });
  };

  return (
    <div className="w-full h-fit flex-center flex-col">
      {isLogin && isPending ? (
        <div className="h-28">
          <div className="loader"></div>
        </div>
      ) : isError ? (
        <p className="text-gray-400 px-10 py-2 text-center">
          사용자 정보를 가져오는 중 오류가 발생했습니다
        </p>
      ) : !recruiting && !isMember ? (
        <p className="text-gray-400 px-10 py-2 text-center">
          모집이 마감되었습니다
        </p>
      ) : isMember ? (
        <>
          <FeedCreateButton className="w-60" />
          <button
            type="button"
            className="self-end p-2 hover:underline hover:underline-offset-4"
            onClick={handleLeaveParticipate}
          >
            탈퇴하기
          </button>
        </>
      ) : (
        <Button className="w-60" onClick={handleJoinParticipate}>
          참여하기
        </Button>
      )}
    </div>
  );
}

export default UserAction;

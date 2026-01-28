"use client";

import FeedCreateButton from "@/domain/feed/components/FeedCreateButton";
import Button from "@/shared/components/Button";
import { useAuthStore } from "@/store/authStore";
import { useJoinTogether } from "../api/useJoinTogether";
import { useLeaveTogether } from "../api/useLeaveTogether";

function UserAction({ id }: { id: number }) {
  const isLogin = useAuthStore((store) => !!store.me);

  const { mutate: joinTogether } = useJoinTogether({
    onSuccess: () => {
      //  TODO : isMember 불러오는거 invalidate
      alert("참여가 완료되었습니다.");
    },
  });

  const { mutate: leaveTogether } = useLeaveTogether({
    onSuccess: () => {
      //  TODO : isMember 불러오는거 invalidate
      alert("탈퇴가 완료되었습니다.");
    },
  });

  // 멤버인지 확인하는 로직필요 -> 로그아웃하면 다시
  const isMember = false;

  const handleJoinParticipate = () => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    } else {
      joinTogether(id);
    }
  };

  const handleLeaveParticipate = () => {
    leaveTogether(id);
  };

  return (
    <div className="w-full h-fit flex-center flex-col">
      {isMember ? (
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

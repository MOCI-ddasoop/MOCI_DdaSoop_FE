"use client";

import UserAction from "@/domain/together/components/UserAction";
import Capsule from "@/shared/components/Capsule";

import { categoryType, isOnlineType } from "@/shared/constants/filter";
import { useGetTogetherById } from "../api/useGetTogetherById";
import TreeProgress from "@/domain/participation/components/TreeProgress";
import ProgressBar from "@/domain/participation/components/ProgressBar";

type Props = {
  id: string;
};

function TogetherDetailInfo({ id }: Props) {
  const { data } = useGetTogetherById(id);

  if (!data?.data) return null;

  const {
    title,
    category,
    startDate,
    endDate,
    progress,
    mode,
    capacity,
    participants,
    goal,
  } = data.data;

  const currentParticipant =
    participants.filter((p) => p.participantsStatus === "PARTICIPATING")
      .length ?? 0;
  const participantCount = participants.length ?? 0;

  return (
    <div className="sticky top-20 w-62 h-fit flex flex-col gap-1.5">
      <h1 className="text-2xl font-medium">{title}</h1>

      <div className="flex gap-2 flex-wrap">
        <Capsule
          text={categoryType[category ?? "ETC"]}
          type="category"
          readOnly
        />

        <Capsule text={isOnlineType[mode]} type="isOnline" readOnly />

        {capacity && (
          <Capsule
            text={participantCount < capacity ? "모집중" : "모집완료"}
            type="status"
            readOnly
          />
        )}
      </div>

      <p className="text-sm text-gray-500">
        기간 {startDate} - {endDate}
      </p>

      <p className="font-semibold whitespace-pre">
        {currentParticipant}명이 함께하고 있어요 !
      </p>

      <TreeProgress progress={progress ?? 0} />

      <ProgressBar
        type="together"
        progress={progress ?? 0}
        goal={goal ?? 0}
        cardUI={false}
      />

      <UserAction
        id={Number(id)}
        recruiting={(!!capacity && participantCount < capacity) || !!!capacity}
      />
    </div>
  );
}

export default TogetherDetailInfo;

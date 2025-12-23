import UserAction from "@/domain/together/components/UserAction";

import TreeProgress from "./TreeProgress";
import Capsule from "@/shared/components/Capsule";
import ProgressBar from "@/shared/components/ProgressBar";

export interface DetailInfoProps {
  type: "together" | "donate";
  title: string;
  category: string;
  dDay?: number; // 후원만
  participant?: number; // 참여자수(제한인원 있는 경우만 표시)
  status?: string; // 모집중 모집완료(제한인원 있는 경우만 표시)
  startDate: string;
  endDate: string;
  isOnline?: string; // 함께하기만
  goal: number;
  progress: number;
}

function DetailInfo({
  props: {
    type,
    title,
    category,
    dDay,
    participant,
    status,
    startDate,
    endDate,
    isOnline,
    goal,
    progress,
  },
}: {
  props: DetailInfoProps;
}) {
  return (
    <div className="sticky top-20 w-62 h-fit flex flex-col gap-1.5">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="flex gap-2 flex-wrap">
        <Capsule text={category} type="category" readOnly />
        {type === "together" && isOnline && (
          <Capsule text={isOnline} type="isOnline" readOnly />
        )}
        {type === "together" && status && (
          <Capsule text={status} type="status" readOnly />
        )}
      </div>
      <p className="text-sm text-gray-500">
        기간 {startDate} - {endDate}
      </p>
      {type === "together" ? (
        <p className="font-semibold whitespace-pre">
          {participant}명이 함께하고 있어요 !
        </p>
      ) : (
        <p className="text-lg">D-{dDay}</p>
      )}
      <TreeProgress progress={progress} />
      <ProgressBar type={type} progress={progress} goal={goal} cardUI={false} />
      <UserAction />
    </div>
  );
}

export default DetailInfo;

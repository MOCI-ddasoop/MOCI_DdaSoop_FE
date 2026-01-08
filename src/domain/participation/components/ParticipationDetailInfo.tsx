import UserAction from "@/domain/together/components/UserAction";

import Capsule from "@/shared/components/Capsule";
import DonateButton from "@/domain/donate/components/DonateButton";
import TreeProgress from "./TreeProgress";
import ProgressBar from "./ProgressBar";
import { DetailInfoProps } from "../types";
import { categoryType, isOnlineType } from "@/shared/constants/filter";

function ParticipationDetailInfo({
  type,
  props: {
    // id, memberId
    title,
    category,
    dDay,
    participant,
    capacity,
    startDate,
    endDate,
    mode,
    goal,
    progress,
  },
}: {
  type: "together" | "donate";
  props: DetailInfoProps;
}) {
  return (
    <div className="sticky top-20 w-62 h-fit flex flex-col gap-1.5">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="flex gap-2 flex-wrap">
        <Capsule text={categoryType[category]} type="category" readOnly />
        {type === "together" && mode && (
          <Capsule text={isOnlineType[mode]} type="isOnline" readOnly />
        )}
        {type === "together" && capacity && (
          <Capsule
            text={(participant ?? 0) < capacity ? "모집중" : "모집완료"}
            type="status"
            readOnly
          />
        )}
      </div>
      <p className="text-sm text-gray-500">
        기간 {startDate} - {endDate}
      </p>
      {type === "together" ? (
        <p className="font-semibold whitespace-pre">
          {participant ?? 0}명이 함께하고 있어요 !
        </p>
      ) : (
        <p className="text-lg">D-{dDay}</p>
      )}
      <TreeProgress progress={progress ?? 0} />
      <ProgressBar
        type={type}
        progress={progress ?? 0}
        goal={goal ?? 0}
        cardUI={false}
      />
      {type === "together" ? <UserAction /> : <DonateButton />}
    </div>
  );
}

export default ParticipationDetailInfo;

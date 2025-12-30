import UserAction from "@/domain/together/components/UserAction";

import Capsule from "@/shared/components/Capsule";
import DonateButton from "@/domain/donate/components/DonateButton";
import TreeProgress from "./TreeProgress";
import ProgressBar from "./ProgressBar";
import { DetailInfoProps } from "../types";

function ParticipationDetailInfo({
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
      {type === "together" ? <UserAction /> : <DonateButton />}
    </div>
  );
}

export default ParticipationDetailInfo;

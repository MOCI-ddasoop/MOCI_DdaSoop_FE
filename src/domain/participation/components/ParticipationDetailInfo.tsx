import UserAction from "@/domain/together/components/UserAction";

import Capsule from "@/shared/components/Capsule";
import DonateButton from "@/domain/donate/components/DonateButton";
import TreeProgress from "./TreeProgress";
import ProgressBar from "./ProgressBar";
import { categoryType, isOnlineType } from "@/shared/constants/filter";
import { TogetherDetailInfo } from "@/domain/together/types";
import { DonateDetailInfo } from "@/domain/donate/types";

type ParticipationDetailInfoProps =
  | {
      type: "together";
      props: TogetherDetailInfo;
    }
  | {
      type: "donate";
      props: DonateDetailInfo;
    };

function ParticipationDetailInfo({
  type,
  props,
}: ParticipationDetailInfoProps) {
  const { id, title, category, startDate, endDate, progress } = props;
  return (
    <div className="sticky top-20 w-62 h-fit flex flex-col gap-1.5">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="flex gap-2 flex-wrap">
        <Capsule
          text={categoryType[category ?? "ETC"]}
          type="category"
          readOnly
        />
        {type === "together" && (
          <Capsule text={isOnlineType[props.mode]} type="isOnline" readOnly />
        )}
        {type === "together" && props.capacity && (
          <Capsule
            text={
              (props.participants?.length ?? 0) < props.capacity
                ? "모집중"
                : "모집완료"
            }
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
          {props.participants?.length ?? 0}명이 함께하고 있어요 !
        </p>
      ) : (
        <p className="text-lg">D-{props.dDay}</p>
      )}
      <TreeProgress progress={progress ?? 0} />
      <ProgressBar
        type={type}
        progress={progress ?? 0}
        goal={type === "together" ? (props.goal ?? 0) : (props.goalAmount ?? 0)}
        cardUI={false}
      />
      {type === "together" ? <UserAction id={id!} /> : <DonateButton />}
    </div>
  );
}

export default ParticipationDetailInfo;

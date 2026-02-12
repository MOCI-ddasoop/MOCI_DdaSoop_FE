import Image from "next/image";
import Link from "next/link";
import ProgressBar from "./ProgressBar";
import Capsule from "@/shared/components/Capsule";
import { categoryType, isOnlineType } from "@/shared/constants/filter";
import { MyTogetherInfo, TogetherInfo } from "@/domain/together/types";
import { DonateInfo } from "@/domain/donate/types";

/**
 *
 * @param type : "together" | "donate"
 * @param  href : string
 * @param image : string
 * @param title : string
 * @param category : string
 * @param dDay : number
 *
 * type = "together" 인 경우
 * @param participant? : number
 * @param capacity? : number
 * @param status? : string
 * @param startDate : string
 * @param endDate : string
 * @param isOnline : string
 *
 * type = "donate" 인 경우
 * @param progress : number
 * @returns
 */
function ParticipationCard(
  props:
    | ({ type: "together" } & TogetherInfo)
    | ({ type: "myTogether" } & MyTogetherInfo)
    | ({ type: "donate" } & DonateInfo),
) {
  const { type, id, thumbnailImage, title, category } = props;

  return (
    <Link
      href={`/${type === "myTogether" ? "together" : type}/${id}`}
      className="relative flex flex-col justify-between min-w-[230px] w-full xl:max-w-[230px] h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg"
    >
      <div className="relative w-full h-[150px] rounded-t-lg overflow-hidden shrink-0">
        <Image
          fill
          alt={title}
          src={
            thumbnailImage ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU"
          }
          className="object-cover"
        />
      </div>
      <div className="px-5 py-3 flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {type !== "myTogether" && (
            <h2
              className={`${props.dDay < 0 ? "text-sm text-mainblue" : "font-bold"}`}
            >
              {props.dDay === 0
                ? "D-day"
                : props.dDay < 0
                  ? "모집종료"
                  : `D-${props.dDay}`}
            </h2>
          )}
          {type === "together" || type === "myTogether" ? (
            <p className="text-xs text-gray-500">
              {props.startDate}~{props.endDate}
            </p>
          ) : (
            <ProgressBar type={type} cardUI progress={props.progress ?? 0} />
          )}
        </div>
        <h1 className={`font-semibold text-lg min-w-full line-clamp-2`}>
          {title}
        </h1>
        <div className={`w-full overflow-x-clip`}>
          <div className="flex gap-1.5 items-center w-max hover:overflow-scroll-animation">
            <Capsule text={categoryType[category] ?? "기타"} readOnly />
            {(type === "together" || type === "myTogether") && (
              <Capsule
                type="isOnline"
                text={`${isOnlineType[props.mode]}`}
                readOnly
              />
            )}
          </div>
        </div>
        {type === "together" && props.capacity && (
          <Capsule
            type="participant"
            text={
              (props.participants?.length ?? 0) >= props.capacity ||
              props.dDay < 0
                ? `${props.dDay < 0 ? "모집종료" : "모집완료"} ${props.participants?.length ?? 0}/${props.capacity}`
                : `모집중 ${props.participants?.length ?? 0}/${props.capacity}`
            }
            className="absolute top-3 right-3"
          />
        )}
      </div>
    </Link>
  );
}

export default ParticipationCard;

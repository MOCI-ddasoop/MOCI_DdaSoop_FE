import Image from "next/image";
import Link from "next/link";
import ProgressBar from "./ProgressBar";
import Capsule from "@/shared/components/Capsule";
import { DonateCardProps, TogetherCardProps } from "../types";

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
function ParticipationCard(props: TogetherCardProps | DonateCardProps) {
  const { type, href, image, title, category, dDay } = props;

  return (
    <Link
      href={href}
      className="relative flex flex-col justify-between min-w-[230px] w-full xl:max-w-[230px] h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg"
    >
      <div className="relative w-full h-[150px] rounded-t-lg overflow-hidden shrink-0">
        <Image fill alt={title} src={image} className="object-cover" />
      </div>
      <div className="px-5 py-3 flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">D-{dDay === 0 ? "day" : dDay}</h2>
          {type === "together" ? (
            <p className="text-xs text-gray-500">
              {props.startDate} - {props.endDate}
            </p>
          ) : (
            <ProgressBar type={type} cardUI progress={props.progress} />
          )}
        </div>
        <h1 className={`font-semibold text-lg min-w-full line-clamp-2`}>
          {title}
        </h1>
        <div className={`w-full overflow-x-clip`}>
          <div className="flex gap-1.5 items-center w-max hover:overflow-scroll-animation">
            <Capsule text={category} readOnly />
            {type === "together" && (
              <Capsule type="isOnline" text={props.isOnline} readOnly />
            )}
          </div>
        </div>
        {type === "together" && props.status && (
          <Capsule
            type="participant"
            text={
              props.status === "모집중"
                ? `${props.status} ${props.participant}/${props.capacity}`
                : props.status
            }
            className="absolute top-3 right-3"
          />
        )}
      </div>
    </Link>
  );
}

export default ParticipationCard;

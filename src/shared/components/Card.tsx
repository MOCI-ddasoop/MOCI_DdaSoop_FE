import Image from "next/image";
import Capsule from "./Capsule";
import Link from "next/link";
import ProgressBar from "./ProgressBar";

// 타입변경될 수 있음 유니온타입으로 바꿀 수 있는거 바꾸기
interface BaseCardProps {
  type: "together" | "donate";
  href: string;
  image: string;
  title: string;
  category: string;
  dDay: number; // 남은날짜
}

export interface TogetherCardProps extends BaseCardProps {
  type: "together";
  participant?: number; // 참여자수(제한인원 있는 경우만 표시)
  capacity?: number; // 제한인원(있는경우)
  status?: string; // 모집중 모집완료
  startDate: string;
  endDate: string;
  isOnline: string;
}

export interface DonateCardProps extends BaseCardProps {
  type: "donate";
  progress: number; // 진행률
}

/**
 *
 * @param type : "together" | "donate"
 * @param props  href : string
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
function Card(props: TogetherCardProps | DonateCardProps) {
  const { type, href, image, title, category, dDay } = props;

  return (
    <Link
      href={href}
      className="relative flex flex-col justify-between w-[230px] h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg"
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
        <h1
          className={`font-semibold text-lg min-w-full ${
            type === "together" && props.status
              ? "line-clamp-1"
              : "line-clamp-2"
          }`}
        >
          {title}
        </h1>
        <div
          className={`flex flex-wrap gap-1.5 items-center overflow-hidden ${
            type === "together" && props.status ? "max-h-16" : "max-h-7"
          }`}
        >
          <Capsule text={category} readOnly />
          {type === "together" && (
            <>
              <Capsule type="isOnline" text={props.isOnline} readOnly />
              {props.status && (
                <Capsule text={props.status} type="status" readOnly />
              )}
            </>
          )}
        </div>
        {type === "together" && props.capacity && props.participant && (
          <Capsule
            type="participant"
            text={`모집인원 ${props.participant}/${props.capacity}`}
            className="absolute top-3 right-3"
          />
        )}
      </div>
    </Link>
  );
}

export default Card;

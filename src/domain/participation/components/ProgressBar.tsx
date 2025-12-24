import { formatMoney } from "@/shared/utils/formatMoney";

interface ProgressBarProps {
  type: "donate" | "together";
  progress: number;
}

interface CardUIProps extends ProgressBarProps {
  cardUI: true;
}

interface InDetailPage extends ProgressBarProps {
  cardUI: false;
  goal: number;
}

/**
 *
 * @param type : "donate" | "together"
 * @param progress : number
 * @param cardUI : boolean
 * @param goal : number
 *
 * cardUI = false인 경우 goal 전달필요
 *
 * @returns
 */
function ProgressBar(props: CardUIProps | InDetailPage) {
  const { type, cardUI, progress } = props;
  return (
    <div
      className={`flex flex-col ${
        cardUI ? "w-3/5 items-end" : "w-full  gap-2 "
      }`}
    >
      {cardUI && <p className="text-sm">{progress}% 달성완료</p>}
      <div className="relative w-full h-3 rounded-full bg-gray-300 overflow-hidden">
        <span
          className={`absolute left-0 top-0 h-3 ${
            type === "donate" ? "bg-mainred" : "bg-mainblue"
          } rounded-full progress-animate transition-all duration-500`}
          style={{ width: `${progress}%` }}
        ></span>
      </div>
      {!cardUI && (
        <div className="w-full flex justify-between items-center">
          <p className="text-xl font-medium">{progress}%</p>
          <p className="text-gray-600">
            {type === "donate"
              ? `${formatMoney(props.goal)}원`
              : `${props.goal}개`}{" "}
            목표
          </p>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;

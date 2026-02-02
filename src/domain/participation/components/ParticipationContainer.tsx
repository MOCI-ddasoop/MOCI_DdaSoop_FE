import { TogetherInfo } from "@/domain/together/types";
import AddParticipationCard from "./AddParticipationCard";
import ParticipationCard from "./ParticipationCard";
import tw from "@/shared/utils/tw";
import { DonateInfo } from "@/domain/donate/types";

interface TogetherContainerProps {
  type: "together";
  currentPage?: number;
  items: TogetherInfo[];
  mypage?: boolean;
  className?: string;
  isLogin: boolean;
}
interface DonateContainerProps {
  type: "donate";
  currentPage?: number;
  items: TogetherInfo[] | DonateInfo[];
  mypage?: boolean;
  className?: string;
  isLogin: boolean;
}

function ParticipationContainer({
  type,
  currentPage,
  items,
  mypage,
  className,
  isLogin,
}: TogetherContainerProps | DonateContainerProps) {
  return items.length === 0 ? (
    !mypage ? (
      <AddParticipationCard type={type} fullWidth isLogin={isLogin} />
    ) : (
      <p className="text-gray-400">내역이 존재하지 않습니다</p>
    )
  ) : (
    <div
      className={tw(
        `w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2 `,
        className,
      )}
    >
      {currentPage === 1 && !mypage && (
        <AddParticipationCard type={type} isLogin={isLogin} />
      )}
      {type === "together"
        ? items.map((item) => (
            <ParticipationCard type={type} key={item.id} {...item} />
          ))
        : items.map((item) => (
            <ParticipationCard type={type} key={item.id} {...item} />
          ))}
    </div>
  );
}

export default ParticipationContainer;

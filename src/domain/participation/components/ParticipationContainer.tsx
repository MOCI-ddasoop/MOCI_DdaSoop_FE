import { DonateCardProps, TogetherCardProps } from "../types";
import AddParticipationCard from "./AddParticipationCard";
import ParticipationCard from "./ParticipationCard";

interface TogetherContainerProps {
  type: "together";
  currentPage?: number;
  items: Omit<TogetherCardProps, "type">[];
  mypage?: boolean;
}
interface DonateContainerProps {
  type: "donate";
  currentPage?: number;
  items: Omit<DonateCardProps, "type">[];
  mypage?: boolean;
}

function ParticipationContainer({
  type,
  currentPage,
  items,
  mypage,
}: TogetherContainerProps | DonateContainerProps) {
  return items.length === 0 ? (
    !mypage ? (
      <AddParticipationCard type={type} fullWidth />
    ) : (
      <p className="text-gray-500">내역이 존재하지 않습니다</p>
    )
  ) : (
    <div className="w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2">
      {currentPage === 1 && !mypage && <AddParticipationCard type={type} />}
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

import { DonateCardProps, TogetherCardProps } from "../types";
import AddParticipationCard from "./AddParticipationCard";
import ParticipationCard from "./ParticipationCard";

interface TogetherContainerProps {
  type: "together";
  currentPage?: number;
  items: Omit<TogetherCardProps, "type">[];
}
interface DonateContainerProps {
  type: "donate";
  currentPage?: number;
  items: Omit<DonateCardProps, "type">[];
}

function ParticipationContainer({
  type,
  currentPage,
  items,
}: TogetherContainerProps | DonateContainerProps) {
  return items.length === 0 ? (
    <AddParticipationCard type={type} fullWidth />
  ) : (
    <div className="w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2">
      {currentPage === 1 && <AddParticipationCard type={type} />}
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

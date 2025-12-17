import AddNewCard from "@/shared/components/AddNewCard";
import Card, {
  DonateCardProps,
  TogetherCardProps,
} from "@/shared/components/Card";

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

function ItemContainer({
  type,
  currentPage,
  items,
}: TogetherContainerProps | DonateContainerProps) {
  return (
    <div className="w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2">
      {currentPage === 1 && <AddNewCard type={type} />}
      {type === "together"
        ? items.map((item, i) => <Card type={type} key={i} {...item} />)
        : items.map((item, i) => <Card type={type} key={i} {...item} />)}
    </div>
  );
}

export default ItemContainer;

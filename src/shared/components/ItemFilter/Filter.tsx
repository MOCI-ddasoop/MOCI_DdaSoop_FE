import { categoryType, isOnlineType } from "@/shared/constants/filter";
import Capsule from "../Capsule";
import { getKeyByValue } from "@/shared/utils/getKeyByValue";

interface FilterProps {
  items: string[];
  selectedItems: string[];
  type: "category" | "isOnline";
  onSelected: (item: string, type: "category" | "isOnline") => void;
}

function Filter({ items, selectedItems, type, onSelected }: FilterProps) {
  return (
    <div className="flex-center gap-2 xl:gap-5 py-2 pr-4 lg:pr-8">
      <p className=" whitespace-pre">
        {type === "category" ? "카테고리" : "온/오프라인"}
      </p>
      <ul className="flex-center gap-2 xl:gap-5">
        {items.map((item, i) => {
          const itemSelected =
            type === "category"
              ? getKeyByValue(categoryType, item)!
              : getKeyByValue(isOnlineType, item)!;
          return (
            <li key={i}>
              <Capsule
                text={item}
                type={type}
                selected={selectedItems.includes(itemSelected)}
                onClick={() => onSelected(itemSelected, type)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Filter;

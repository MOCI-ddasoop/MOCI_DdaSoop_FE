import Capsule from "../Capsule";

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
        {items.map((item, i) => (
          <li key={i}>
            <Capsule
              text={item}
              type={type}
              selected={selectedItems.includes(item)}
              onClick={() => onSelected(item, type)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Filter;

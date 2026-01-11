"use client";

import {
  categoryOptions,
  onlineOptions,
  sortOptions,
} from "@/shared/constants/filter";
import Filter from "./Filter";
import DropdownButton from "../DropdownButton";

interface ItemFilterProps {
  type: "together" | "donate";
  currentSort: string;
  setCurrentSort: (value: string) => void;
  selectedCategory: string[];
  isOnline?: string[];
  onFilterClicked: (item: string, type: "category" | "isOnline") => void;
  mypage?: boolean;
}

function ItemFilter({
  type,
  currentSort,
  setCurrentSort,
  selectedCategory,
  isOnline,
  onFilterClicked: handleFilter,
  mypage,
}: ItemFilterProps) {
  return mypage ? (
    <></>
  ) : (
    <div className="flex justify-between py-4">
      <div className="flex items-center flex-wrap">
        <Filter
          items={categoryOptions}
          selectedItems={selectedCategory}
          type="category"
          onSelected={handleFilter}
        />
        {type === "together" && (
          <Filter
            items={onlineOptions}
            selectedItems={isOnline!}
            type="isOnline"
            onSelected={handleFilter}
          />
        )}
      </div>
      <DropdownButton
        options={sortOptions}
        selected={currentSort}
        setSelected={setCurrentSort}
        dropdown
      />
    </div>
  );
}

export default ItemFilter;

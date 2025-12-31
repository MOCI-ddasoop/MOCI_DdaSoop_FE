"use client";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { DonateCardProps } from "@/domain/participation/types";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import ItemFilter from "@/shared/components/ItemFilter";
import Pagination from "@/shared/components/Pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DonateSectionProps {
  initialCategory: string[];
  initialPage: number;
  sort: string;
  items: Omit<DonateCardProps, "type">[];
}

function DonateSection({
  initialCategory,
  initialPage,
  sort,
  items,
}: DonateSectionProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(sort);
  const [selectedCategory, setSelectedCategory] =
    useState<string[]>(initialCategory);

  const handleFilter = (item: string) => {
    const newCategory = selectedCategory.includes(item)
      ? selectedCategory.filter((c) => c !== item)
      : [...selectedCategory, item];

    setSelectedCategory(newCategory);
    syncUrl("donate", newCategory, [], currentSort, 1, router);
  };

  const handleSortChange = (nextSort: string) => {
    setCurrentSort(nextSort);
    syncUrl("donate", selectedCategory, [], nextSort, 1, router);
  };
  return (
    <>
      <ItemFilter
        type="donate"
        currentSort={currentSort}
        setCurrentSort={handleSortChange}
        selectedCategory={selectedCategory}
        onFilterClicked={handleFilter}
      />
      <ParticipationContainer
        type="donate"
        items={items}
        currentPage={initialPage}
      />
      <Pagination totalPages={10} />
    </>
  );
}

export default DonateSection;

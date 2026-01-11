"use client";

import Pagination from "@/shared/components/Pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ItemFilter from "@/shared/components/ItemFilter";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { TogetherCardProps } from "@/domain/participation/types";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import { useGetTogetherList } from "../api/useGetTogetherList";

interface TogetherSectionProps {
  initialCategory: string[];
  initialIsOnline: string[];
  initialPage: number;
  sort: string;
  items: Omit<TogetherCardProps, "type">[];
  mypage?: boolean;
}

function TogetherSection({
  initialCategory,
  initialIsOnline,
  initialPage,
  sort,
  items,
  mypage,
}: TogetherSectionProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(sort);
  const [selectedCategory, setSelectedCategory] =
    useState<string[]>(initialCategory);
  const [isOnline, setIsOnline] = useState<string[]>(initialIsOnline);
  // const userId = 1;

  // const { data, isPending } = useGetTogetherList(userId);

  const handleFilter = (item: string, type: "category" | "isOnline") => {
    if (type === "category") {
      const newCategory = selectedCategory.includes(item)
        ? selectedCategory.filter((c) => c !== item)
        : [...selectedCategory, item];

      setSelectedCategory(newCategory);
      syncUrl("together", newCategory, isOnline, currentSort, 1, router);
    } else {
      const newIsOnline = isOnline.includes(item)
        ? isOnline.filter((o) => o !== item)
        : [...isOnline, item];

      setIsOnline(newIsOnline);
      syncUrl(
        "together",
        selectedCategory,
        newIsOnline,
        currentSort,
        1,
        router
      );
    }
  };

  const handleSortChange = (nextSort: string) => {
    setCurrentSort(nextSort);
    syncUrl("together", selectedCategory, isOnline, nextSort, 1, router);
  };

  return (
    <>
      <ItemFilter
        type="together"
        currentSort={currentSort}
        setCurrentSort={handleSortChange}
        selectedCategory={selectedCategory}
        isOnline={isOnline}
        onFilterClicked={handleFilter}
        mypage={mypage}
      />
      <ParticipationContainer
        type="together"
        items={items}
        currentPage={initialPage}
        mypage={mypage}
      />
      <Pagination totalPages={10} />
    </>
  );
}

export default TogetherSection;

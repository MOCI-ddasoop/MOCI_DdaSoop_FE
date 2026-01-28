"use client";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import ItemFilter from "@/shared/components/ItemFilter";
import Pagination from "@/shared/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DonateResponse } from "../types";
import { useAuthStore } from "@/store/authStore";
import { getKeyByValue } from "@/shared/utils/getKeyByValue";
import { sortType } from "@/shared/constants/filter";

interface DonateSectionProps {
  initialCategory: string[];
  initialPage: number;
  sort: string;
  initialData: DonateResponse | undefined;
  mypage?: boolean;
}

function DonateSection({
  initialCategory,
  initialPage,
  sort,
  initialData: items,
  mypage,
}: DonateSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const [currentSort, setCurrentSort] = useState<string>(sort);
  const [selectedCategory, setSelectedCategory] =
    useState<string[]>(initialCategory);

  const isInitialQuery =
    page === 1 && selectedCategory.length === 0 && currentSort === "최신순";

  const userId = useAuthStore((state) => state.me?.memberId);

  const handleFilter = (item: string) => {
    const newCategory = selectedCategory.includes(item)
      ? selectedCategory.filter((c) => c !== item)
      : [...selectedCategory, item];

    setSelectedCategory(newCategory);
    syncUrl("donate", newCategory, [], currentSort, 1, router);
  };

  const handleSortChange = (nextSort: string) => {
    setCurrentSort(nextSort);
    const selectedSort = getKeyByValue(sortType, nextSort);
    if (!selectedSort) return;
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
        mypage={mypage}
      />
      <ParticipationContainer
        type="donate"
        items={items?.data.content ?? []}
        currentPage={initialPage}
        mypage={mypage}
        className={
          items?.data.totalPages && items.data.totalPages <= 1 ? "mb-10" : ""
        }
      />
      <Pagination totalPages={items?.data.totalPages ?? 0} />
    </>
  );
}

export default DonateSection;

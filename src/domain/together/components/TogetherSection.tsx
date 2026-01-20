"use client";

import Pagination from "@/shared/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ItemFilter from "@/shared/components/ItemFilter";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import { useGetTogetherList } from "../api/useGetTogetherList";
import { TogetherResponse } from "../types";
import { getKeyByValue } from "@/shared/utils/getKeyByValue";
import { sortType } from "@/shared/constants/filter";
import { useAuthStore } from "@/store/authStore";

interface TogetherSectionProps {
  initialCategory: string[];
  initialIsOnline: string[];
  initialPage: number;
  sort: string;
  initialData: TogetherResponse;
  mypage?: boolean;
}

function TogetherSection({
  initialCategory,
  initialIsOnline,
  initialPage,
  sort,
  initialData,
  mypage,
}: TogetherSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const [currentSort, setCurrentSort] = useState<string>(sort);
  const [selectedCategory, setSelectedCategory] =
    useState<string[]>(initialCategory);
  const [isOnline, setIsOnline] = useState<string[]>(initialIsOnline);
  const isInitialQuery =
    page === 1 &&
    selectedCategory.length === 0 &&
    isOnline.length === 0 &&
    currentSort === "최신순";

  const userId = useAuthStore((state) => state.me?.memberId);
  const {
    data: items,
    isPending,
    isError,
  } = useGetTogetherList(
    {
      category: selectedCategory,
      mode: isOnline[0],
      sortType: getKeyByValue(sortType, currentSort),
      page: page - 1,
      size: 12,
      userId: mypage ? userId : undefined,
    },
    { initialData: isInitialQuery ? initialData : undefined }
  );

  const handleFilter = (item: string, type: "category" | "isOnline") => {
    if (type === "category") {
      const newCategory = selectedCategory.includes(item)
        ? selectedCategory.filter((c) => c !== item)
        : [...selectedCategory, item];

      setSelectedCategory(newCategory);
      syncUrl("together", newCategory, isOnline, currentSort, 1, router);
    } else {
      const newIsOnline = isOnline[0] === item ? [] : [item];

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
    const selectedSort = getKeyByValue(sortType, nextSort);
    if (!selectedSort) return;
    syncUrl("together", selectedCategory, isOnline, selectedSort, 1, router);
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
      {isError ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : (
        <ParticipationContainer
          type="together"
          items={items.data.content ?? []}
          currentPage={page}
          mypage={mypage}
          className={items?.data.totalPages <= 1 ? "mb-10" : ""}
        />
      )}
      <Pagination totalPages={items?.data.totalPages ?? 0} />
    </>
  );
}

export default TogetherSection;

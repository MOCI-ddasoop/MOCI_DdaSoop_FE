"use client";

import Pagination from "@/shared/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ItemFilter from "@/shared/components/ItemFilter";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import { useGetTogetherList } from "../api/useGetTogetherList";
import { TogetherResponse } from "../types";
import { getKeyByValue } from "@/shared/utils/getKeyByValue";
import { sortType } from "@/shared/constants/filter";
import { useAuthStore } from "@/store/authStore";

interface TogetherSectionProps {
  initialData: TogetherResponse | undefined;
}

function TogetherSection({ initialData }: TogetherSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const selectedCategory =
    searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const isOnline =
    searchParams.get("isOnline")?.split(",").filter(Boolean) ?? [];
  const currentSort = searchParams.get("sort") ?? "LATEST";

  const isInitialQuery =
    page === 1 &&
    selectedCategory.length === 0 &&
    isOnline.length === 0 &&
    currentSort === "LATEST";
  const userId = useAuthStore((state) => state.me?.memberId);
  const { data, isPending, isError } = useGetTogetherList(
    {
      category: selectedCategory,
      mode: isOnline[0],
      sortType: currentSort,
      page: page - 1,
      size: 12,
    },
    {
      initialData: isInitialQuery ? initialData : undefined,
    },
  );

  const items = useMemo(() => {
    if (!data) return undefined;
    if (page !== 1) return data;
    return {
      ...data,
      data: {
        ...data.data,
        content: data.data.content.slice(1),
      },
    };
  }, [data, page]);

  const handleFilter = (item: string, type: "category" | "isOnline") => {
    if (type === "category") {
      const newCategory = selectedCategory.includes(item)
        ? selectedCategory.filter((c) => c !== item)
        : [...selectedCategory, item];

      syncUrl("together", newCategory, isOnline, currentSort, 1, router);
    } else {
      const newIsOnline = isOnline[0] === item ? [] : [item];

      syncUrl(
        "together",
        selectedCategory,
        newIsOnline,
        currentSort,
        1,
        router,
      );
    }
  };

  const handleSortChange = (nextSort: string) => {
    const selectedSort = getKeyByValue(sortType, nextSort);
    if (!selectedSort) return;
    syncUrl("together", selectedCategory, isOnline, selectedSort, 1, router);
  };

  return (
    <>
      <ItemFilter
        type="together"
        currentSort={sortType[currentSort as keyof typeof sortType]}
        setCurrentSort={handleSortChange}
        selectedCategory={selectedCategory}
        isOnline={isOnline}
        onFilterClicked={handleFilter}
      />
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : (
        items && (
          <ParticipationContainer
            type="together"
            items={items.data.content ?? []}
            currentPage={page}
            className={items?.data.totalPages <= 1 ? "mb-10" : ""}
            isLogin={!!userId}
          />
        )
      )}
      {items && <Pagination totalPages={items?.data.totalPages ?? 0} />}
    </>
  );
}

export default TogetherSection;

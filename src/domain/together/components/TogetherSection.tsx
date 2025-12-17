"use client";

import { TogetherCardProps } from "@/shared/components/Card";
import Pagination from "@/shared/components/Pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ItemContainer from "@/shared/components/ItemContainer";
import ItemFilter from "@/shared/components/ItemFilter";

interface TogetherSectionProps {
  initialCategory: string[];
  initialIsOnline: string[];
  initialPage: number;
  sort: string;
  items: Omit<TogetherCardProps, "type">[];
}

function TogetherSection({
  initialCategory,
  initialIsOnline,
  initialPage,
  sort,
  items,
}: TogetherSectionProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(sort);
  const [selectedCategory, setSelectedCategory] =
    useState<string[]>(initialCategory);
  const [isOnline, setIsOnline] = useState<string[]>(initialIsOnline);
  const [page, setPage] = useState<number>(initialPage);

  const handleFilter = (item: string, type: "category" | "isOnline") => {
    if (type === "category") {
      const newCategory = selectedCategory.includes(item)
        ? selectedCategory.filter((c) => c !== item)
        : [...selectedCategory, item];

      setSelectedCategory(newCategory);
      setPage(1);
      syncUrl(newCategory, isOnline, currentSort, 1);
    } else {
      const newIsOnline = isOnline.includes(item)
        ? isOnline.filter((o) => o !== item)
        : [...isOnline, item];

      setIsOnline(newIsOnline);
      setPage(1);
      syncUrl(selectedCategory, newIsOnline, currentSort, 1);
    }
  };

  const syncUrl = (
    category: string[],
    isOnline: string[],
    sort: string,
    page: number
  ) => {
    const params = new URLSearchParams();
    if (category.length > 0) {
      params.set("category", category.join(","));
    }
    if (isOnline.length > 0) {
      params.set("isOnline", isOnline.join(","));
    }
    params.set("page", page.toString());
    params.set("sort", sort);
    router.replace(`/together?${params.toString()}`);
  };

  const handleSortChange = (nextSort: string) => {
    setCurrentSort(nextSort);
    setPage(1);
    syncUrl(selectedCategory, isOnline, nextSort, 1);
  };

  return (
    <>
      <ItemFilter
        currentSort={currentSort}
        setCurrentSort={handleSortChange}
        selectedCategory={selectedCategory}
        isOnline={isOnline}
        onFilterClicked={handleFilter}
      />
      <ItemContainer type="together" items={items} currentPage={page} />
      <Pagination totalPages={10} />
    </>
  );
}

export default TogetherSection;

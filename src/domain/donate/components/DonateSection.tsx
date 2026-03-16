"use client";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { syncUrl } from "@/domain/participation/utils/syncUrl";
import ItemFilter from "@/shared/components/ItemFilter";
import Pagination from "@/shared/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getKeyByValue } from "@/shared/utils/getKeyByValue";
import { sortType } from "@/shared/constants/filter";
import { useGetDonationList } from "../api/useGetDonationList";

function DonateSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const selectedCategory =
    searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const currentSort = searchParams.get("sort") ?? "LATEST";

  const userId = useAuthStore((state) => state.me?.memberId);

  const {
    data: items,
    isPending,
    isError,
  } = useGetDonationList({
    category: selectedCategory,
    status: undefined,
    sortType: currentSort,
    page: page - 1,
    size: 12,
  });

  const handleFilter = (item: string) => {
    const newCategory = selectedCategory.includes(item)
      ? selectedCategory.filter((c) => c !== item)
      : [...selectedCategory, item];

    syncUrl("donate", newCategory, [], currentSort, 1, router);
  };

  const handleSortChange = (nextSort: string) => {
    const selectedSort = getKeyByValue(sortType, nextSort);
    if (!selectedSort) return;
    syncUrl("donate", selectedCategory, [], selectedSort, 1, router);
  };
  return (
    <>
      <ItemFilter
        type="donate"
        currentSort={sortType[currentSort as keyof typeof sortType]}
        setCurrentSort={handleSortChange}
        selectedCategory={selectedCategory}
        onFilterClicked={handleFilter}
      />
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader loader-red"></div>
        </div>
      ) : (
        items && (
          <ParticipationContainer
            type="donate"
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

export default DonateSection;

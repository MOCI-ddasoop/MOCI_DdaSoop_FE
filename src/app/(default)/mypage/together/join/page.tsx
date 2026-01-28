import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import { getOwnTogetherList } from "@/domain/together/api/getOwnTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { TogetherPageProps } from "@/domain/together/types";
import { sortOptions, sortType } from "@/shared/constants/filter";
import { useAuthStore } from "@/store/authStore";

async function page({ searchParams }: TogetherPageProps) {
  const searchParam = await searchParams;

  const category = searchParam.category?.split(",") ?? [];
  const isOnline = searchParam.isOnline?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort =
    sortType[(searchParam.sort ?? "LATEST") as keyof typeof sortType] ??
    sortOptions[0];

  return (
    <>
      <TogetherSection
        initialCategory={category}
        initialIsOnline={isOnline}
        initialPage={page}
        sort={sort}
        initialData={undefined}
        mypage
      />
    </>
  );
}

export default page;

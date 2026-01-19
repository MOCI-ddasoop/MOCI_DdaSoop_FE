import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { TogetherPageProps } from "@/domain/together/types";
import { sortOptions } from "@/shared/constants/filter";

async function Together({ searchParams }: TogetherPageProps) {
  const searchParam = await searchParams;

  const category = searchParam.category?.split(",") ?? [];
  const isOnline = searchParam.isOnline?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort = searchParam.sort ?? sortOptions[0];

  const initialData = await getInitTogetherList();

  return (
    <>
      <TogetherSection
        initialCategory={category}
        initialIsOnline={isOnline}
        initialPage={page}
        sort={sort}
        initialData={initialData}
      />
    </>
  );
}

export default Together;

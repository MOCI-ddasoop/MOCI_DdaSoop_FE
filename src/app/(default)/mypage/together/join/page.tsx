import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import { getOwnTogetherList } from "@/domain/together/api/getOwnTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { TogetherPageProps } from "@/domain/together/types";
import { sortOptions } from "@/shared/constants/filter";

async function page({ searchParams }: TogetherPageProps) {
  const searchParam = await searchParams;

  const category = searchParam.category?.split(",") ?? [];
  const isOnline = searchParam.isOnline?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort = searchParam.sort ?? sortOptions[0];

  const ITEM_LIST = await getInitTogetherList();
  // const { data: ITEM_LIST } = await getOwnTogetherList(1);

  return (
    <>
      <TogetherSection
        initialCategory={category}
        initialIsOnline={isOnline}
        initialPage={page}
        sort={sort}
        items={ITEM_LIST}
        mypage
      />
    </>
  );
}

export default page;

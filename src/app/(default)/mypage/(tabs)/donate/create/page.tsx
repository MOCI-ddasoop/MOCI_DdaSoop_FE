import DonateSection from "@/domain/donate/components/DonateSection";
import { DonatePageProps } from "@/domain/donate/types";
import { sortOptions, sortType } from "@/shared/constants/filter";

async function page({ searchParams }: DonatePageProps) {
  const searchParam = await searchParams;

  const category = searchParam.category?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort =
    sortType[(searchParam.sort ?? "LATEST") as keyof typeof sortType] ??
    sortOptions[0];

  return (
    <>
      <DonateSection
        initialCategory={category}
        initialPage={page}
        sort={sort}
        initialData={undefined}
        mypage
      />
    </>
  );
}

export default page;

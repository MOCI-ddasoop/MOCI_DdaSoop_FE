import TogetherList from "@/domain/main/components/TogetherList";
import DonationList from "@/domain/main/components/DonationList";
import { DONATION_LIST } from "@/shared/mock/mockup";
import SearchInput from "@/shared/components/SearchInput";
import SearchQueryNotation from "@/domain/search/SearchQueryNotation";
import FeedCardContainer from "@/domain/feed/components/FeedCardContainer";
import { Suspense } from "react";
import FeedCreateButton from "@/domain/feed/components/FeedCreateButton";
import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import { sortOptions } from "@/shared/constants/filter";

const randomList = sortOptions[Math.floor(Math.random() * sortOptions.length)];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  const { data } = await getInitTogetherList({
    fixed: true,
    randomList: randomList,
  });

  return (
    <div className="flex gap-8 py-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FeedCardContainer queryParams={query} />
      </Suspense>
      <div className="sticky top-20 h-[calc(100vh-6rem)] flex flex-col justify-between">
        <div className="h-fit flex flex-col gap-2 items-center">
          <SearchInput />
          <TogetherList items={data.content.slice(1)} type={randomList} />
          <DonationList items={DONATION_LIST} />
        </div>
        <FeedCreateButton className="w-full" />
      </div>
      <SearchQueryNotation searchParams={searchParams} />
    </div>
  );
}

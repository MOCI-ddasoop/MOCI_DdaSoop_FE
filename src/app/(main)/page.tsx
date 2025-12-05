import CardContainer from "@/domain/mypage/components/CardContainer";
import TogetherList from "@/domain/main/components/TogetherList";
import DonationList from "@/domain/main/components/DonationList";
import { TOGETHER_LIST, DONATION_LIST } from "@/shared/mock/mockup";
import SearchInput from "@/shared/components/SearchInput";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  // TODO : SEO 개선을 위해 dehydrate 처리

  return (
    <div className="flex gap-8 py-4">
      <CardContainer queryParams={query} />
      <div className="sticky top-20 min-w-60 h-fit flex flex-col gap-2 items-center">
        <SearchInput />
        <TogetherList togetherList={TOGETHER_LIST} />
        <DonationList donations={DONATION_LIST} />
      </div>
    </div>
  );
}

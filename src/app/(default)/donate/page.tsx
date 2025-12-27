import DonateSection from "@/domain/donate/components/DonateSection";
import { sortOptions } from "@/shared/constants/filter";

interface TogetherPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

async function Together({ searchParams }: TogetherPageProps) {
  const searchParam = await searchParams;

  const category = searchParam.category?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort = searchParam.sort ?? sortOptions[0];

  // 위에있는거 가지고 api 통신해서 가져오기
  const ITEM_LIST = Array.from({ length: 11 }).map((_, index) => ({
    id: index,
    href: `/donate/${index + 1}`,
    image:
      "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    title: `후원하기${index + 1}`,
    category: "카테고리",
    dDay: 10,
    progress: 75,
  }));
  return (
    <>
      <DonateSection
        initialCategory={category}
        initialPage={page}
        sort={sort}
        items={ITEM_LIST}
      />
    </>
  );
}

export default Together;

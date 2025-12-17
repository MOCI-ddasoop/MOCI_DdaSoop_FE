import TogetherSection from "@/domain/together/components/TogetherSection";
import { sortOptions } from "@/shared/constants/filter";

interface TogetherPageProps {
  searchParams: Promise<{
    category?: string;
    isOnline?: string;
    page?: string;
  }>;
  params: Promise<{ sort: string }>;
}

async function Together({ searchParams, params }: TogetherPageProps) {
  const searchParam = await searchParams;
  const param = await params;

  const category = searchParam.category?.split(",") ?? [];
  const isOnline = searchParam.isOnline?.split(",") ?? [];
  const page = Number(searchParam.page ?? 1);
  const sort = param.sort ?? sortOptions[0];

  // 위에있는거 가지고 api 통신해서 가져오기
  const ITEM_LIST = Array.from({ length: 11 }).map((_, index) => ({
    id: index,
    href: `/together/${index + 1}`,
    image:
      "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    title: `함께하기${index + 1}`,
    category: "카테고리",
    dDay: 10,
    participant: 18,
    capacity: 20,
    status: "모집중",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    isOnline: "온라인",
    progress: 75,
  }));
  return (
    <>
      <TogetherSection
        initialCategory={category}
        initialIsOnline={isOnline}
        initialPage={page}
        sort={sort}
        items={ITEM_LIST}
      />
    </>
  );
}

export default Together;

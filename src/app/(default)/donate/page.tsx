import { getInitDonationList } from "@/domain/donate/api/getInitDonationList";
import DonateSection from "@/domain/donate/components/DonateSection";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

async function Donate() {
  // // 위에있는거 가지고 api 통신해서 가져오기
  // const ITEM_LIST = Array.from({ length: 11 }).map((_, index) => ({
  //   id: index,
  //   href: `/donate/${index + 1}`,
  //   image:
  //     "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
  //   title: `후원하기${index + 1}`,
  //   category: "카테고리",
  //   dDay: 10,
  //   progress: 75,
  // }));

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.donate.list({
      category: [],
      status: undefined,
      sortType: "LATEST",
      page: 0,
      size: 12,
    }),
    queryFn: () => getInitDonationList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrationBoundary state={dehydratedState}>
        <DonateSection />
      </HydrationBoundary>
    </Suspense>
  );
}

export default Donate;

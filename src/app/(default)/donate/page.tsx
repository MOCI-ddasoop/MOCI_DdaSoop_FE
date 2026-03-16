import { getInitDonationList } from "@/domain/donate/api/getInitDonationList";
import DonateSection from "@/domain/donate/components/DonateSection";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const title = `후원하기 목록`;

  const description = "다양한 후원에 참여하고 소식을 알아보세요.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.ddasoop.xyz/donate",
    },
    openGraph: {
      title,
      description,
      url: `https://www.ddasoop.xyz/donate`,
      siteName: "따숲",
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "따숲 후원하기 목록",
            url: "https://www.ddasoop.xyz/donate",
          }),
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <HydrationBoundary state={dehydratedState}>
          <DonateSection />
        </HydrationBoundary>
      </Suspense>
    </>
  );
}

export default Donate;

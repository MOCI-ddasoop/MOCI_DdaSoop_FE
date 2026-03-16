import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const title = `함께하기 챌린지 목록`;

  const description = "다양한 챌린지에 참여하고 목표를 함께 달성해보세요.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.ddasoop.xyz/together",
    },
    openGraph: {
      title,
      description,
      url: `https://www.ddasoop.xyz/together`,
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

async function Together() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.together.list({
      category: [],
      mode: undefined,
      status: undefined,
      sortType: "LATEST",
      page: 0,
      size: 12,
    }),
    queryFn: () => getInitTogetherList(),
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
            name: "따숲 함께하기 챌린지 목록",
            url: "https://www.ddasoop.xyz/together",
          }),
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <HydrationBoundary state={dehydratedState}>
          <TogetherSection />
        </HydrationBoundary>
      </Suspense>
    </>
  );
}

export default Together;

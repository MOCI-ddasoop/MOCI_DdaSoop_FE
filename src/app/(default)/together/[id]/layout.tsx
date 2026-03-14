import Loading from "@/domain/participation/components/DetailLoadingSkeleton";
import { getInitTogetherDetail } from "@/domain/together/api/getInitTogetherDetail";
import TogetherDetailInfo from "@/domain/together/components/TogetherDetailInfo";
import ImageSwiper from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { queryKeys } from "@/shared/config/queryKeys";
import { togetherTabContents } from "@/shared/utils/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getInitTogetherDetail(params.id);

  const detail = data.data;

  return {
    title: `따숲 함께하기 | ${detail.title}`,
    description: detail.description ?? "따숲 함께하기 상세 페이지",
    keywords: ["챌린지", "함께하기", "목표달성", "커뮤니티"],
    alternates: {
      canonical: `https://www.ddasoop.xyz/together/${params.id}`,
    },
    openGraph: {
      title: `따숲 함께하기 | ${detail.title}`,
      description: detail.description,
      url: `https://www.ddasoop.xyz/together/${params.id}`,
      siteName: "따숲",
      images: detail.thumbnailImage?.[0]["imageUrl"] ?? "",
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: detail.title,
      description: detail.description,
      images: [detail.thumbnailImage?.[0]["imageUrl"] ?? ""],
    },
  };
}

async function page({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const detailInfo = await queryClient.fetchQuery({
    queryKey: queryKeys.together.id(id),
    queryFn: async () => getInitTogetherDetail(id),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loading />}>
        <div className="flex justify-between pt-4">
          <section className="w-[calc(100%-280px)]">
            <div className="w-full aspect-10/7">
              {/* slideList -> detailInfo에 들어있는 이미지전달 */}
              <ImageSwiper slideList={detailInfo.data.thumbnailImage ?? []} />
            </div>
            <nav>
              <TabBar type="together" tabContents={togetherTabContents(id)} />
            </nav>
            <main className="py-4">{children}</main>
          </section>
          <aside>
            <TogetherDetailInfo id={id} />
          </aside>
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;

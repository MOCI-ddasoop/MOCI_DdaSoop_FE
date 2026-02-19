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
import { Suspense } from "react";

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
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <div className="flex justify-between pt-4">
          <div className="w-[calc(100%-280px)]">
            <div className="w-full aspect-10/7">
              {/* slideList -> detailInfo에 들어있는 이미지전달 */}
              <ImageSwiper slideList={detailInfo.data.thumbnailImage ?? []} />
            </div>
            <TabBar type="together" tabContents={togetherTabContents(id)} />
            <main className="py-4">{children}</main>
          </div>
          <TogetherDetailInfo id={id} />
        </div>
      </HydrationBoundary>
    </Suspense>
  );
}

export default page;

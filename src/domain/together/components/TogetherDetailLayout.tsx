import ParticipationDetailInfo from "@/domain/participation/components/ParticipationDetailInfo";
import { getInitTogetherDetail } from "@/domain/together/api/getInitTogetherDetail";
import DetailInfoHydrator from "@/domain/together/provider/DetailInfoHydrator";
import { TogetherDetailResponse } from "@/domain/together/types";
import ImageSwiper from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { togetherTabContents } from "@/shared/utils/navigation";

export const toTogetherViewModel = (data: TogetherDetailResponse["data"]) => ({
  ...data,
  thumbnailImage: data.thumbnailImage
    ? data.thumbnailImage.map((url) => ({
        imageUrl: url,
      }))
    : [],
});

async function TogetherDetailLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  const { data: detailInfo } = await getInitTogetherDetail(id);

  return (
    <DetailInfoHydrator initialData={detailInfo}>
      <div className="flex justify-between pt-4">
        <div className="w-[calc(100%-280px)]">
          <div className="w-full aspect-10/7">
            {/* slideList -> detailInfo에 들어있는 이미지전달 */}
            <ImageSwiper slideList={detailInfo.thumbnailImage ?? []} />
          </div>
          <TabBar type="together" tabContents={togetherTabContents(id)} />
          <main className="py-4">{children}</main>
        </div>
        <ParticipationDetailInfo type="together" props={detailInfo} />
      </div>
    </DetailInfoHydrator>
  );
}

export default TogetherDetailLayout;

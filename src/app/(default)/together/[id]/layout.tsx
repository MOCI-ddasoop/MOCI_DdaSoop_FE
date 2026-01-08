import ParticipationDetailInfo from "@/domain/participation/components/ParticipationDetailInfo";
import { DetailInfoProps } from "@/domain/participation/types";
import { getInitTogetherDetail } from "@/domain/together/api/getInitTogetherDetail";
import DetailInfoHydrator from "@/domain/together/provider/DetailInfoHydrator";
import ImageSwiper, { dummyImageList } from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { togetherTabContents } from "@/shared/utils/navigation";

// const DETAIL_INFO_DUMMY: DetailInfoProps = {
//   id: "",
//   type: "together",
//   title: "함께하기",
//   category: "카테고리1",
//   participant: 7, // 참여자수(제한인원 있는 경우만 표시)
//   status: "모집중", // 모집중 모집완료
//   startDate: "2024-06-01",
//   endDate: "2024-06-30",
//   isOnline: "온라인",
//   goal: 100,
//   progress: 40,
// };

async function page({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const detailInfo: DetailInfoProps = await getInitTogetherDetail(id);

  return (
    <DetailInfoHydrator initialData={detailInfo}>
      <div className="flex justify-between pt-4">
        <div className="w-[calc(100%-280px)]">
          <div className="w-full aspect-10/7">
            {/* slideList -> detailInfo에 들어있는 이미지전달 */}
            <ImageSwiper slideList={dummyImageList} />
          </div>
          <TabBar type="together" tabContents={togetherTabContents(id)} />
          <main className="py-4">{children}</main>
        </div>
        <ParticipationDetailInfo props={detailInfo} />
      </div>
    </DetailInfoHydrator>
  );
}

export default page;

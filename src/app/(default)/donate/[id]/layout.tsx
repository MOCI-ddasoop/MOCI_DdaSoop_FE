import { getInitDonationDetail } from "@/domain/donate/api/getInitDonationDetail";
import DetailInfoHydrator from "@/domain/donate/provider/DetailInfoHydrator";
import ParticipationDetailInfo from "@/domain/participation/components/ParticipationDetailInfo";
import { DetailInfoProps } from "@/domain/participation/types";
import ImageSwiper from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { donateTabContents } from "@/shared/utils/navigation";

const DETAIL_INFO_DUMMY: DetailInfoProps = {
  id: "",
  type: "donate",
  title: "후원하기",
  category: "카테고리1",
  dDay: 12,
  participant: 7, // 참여자수(제한인원 있는 경우만 표시)
  status: "모집중", // 모집중 모집완료
  startDate: "2024-06-01",
  endDate: "2024-06-30",
  goal: 100,
  progress: 40,
};

async function page({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const detailInfo = await getInitDonationDetail(id);
  return (
    <DetailInfoHydrator initialData={detailInfo}>
      <div className="flex justify-between pt-4">
        <div className="w-[calc(100%-280px)]">
          <div className="w-full aspect-10/7">
            <ImageSwiper slideList={dummyImageList} />
          </div>
          <TabBar type="donate" tabContents={donateTabContents(id)} />
          <main className="py-4">{children}</main>
        </div>
        <ParticipationDetailInfo props={DETAIL_INFO_DUMMY} />
      </div>
    </DetailInfoHydrator>
  );
}

export default page;

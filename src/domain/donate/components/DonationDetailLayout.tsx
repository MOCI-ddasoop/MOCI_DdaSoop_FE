import { getInitDonationDetail } from "@/domain/donate/api/getInitDonationDetail";
import DetailInfoHydrator from "@/domain/donate/provider/DetailInfoHydrator";
import ParticipationDetailInfo from "@/domain/participation/components/ParticipationDetailInfo";
import ImageSwiper from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { donateTabContents } from "@/shared/utils/navigation";

// const DETAIL_INFO_DUMMY: DonateDetailInfo = {
//   id: 0,
//   thumbnailImage: [],
//   title: "후원하기",
//   category: "PLOGGING",
//   dDay: 12,
//   participants: 7, // 참여자수(제한인원 있는 경우만 표시)
//   startDate: "2024-06-01",
//   endDate: "2024-06-30",
//   goal: 100,
//   progress: 40,
//   memberId: 1,
// };

async function DonateDetailLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const { data: detailInfo } = await getInitDonationDetail(id);
  return (
    <DetailInfoHydrator type="donate" initialData={detailInfo}>
      <div className="flex justify-between pt-4">
        <div className="w-[calc(100%-280px)]">
          <div className="w-full aspect-10/7">
            <ImageSwiper
              slideList={
                detailInfo.thumbnailImage
                  ? [{ imageUrl: detailInfo.thumbnailImage }]
                  : []
              }
            />
          </div>
          <TabBar type="donate" tabContents={donateTabContents(id)} />
          <main className="py-4">{children}</main>
        </div>
        <ParticipationDetailInfo type="donate" props={detailInfo} />
      </div>
    </DetailInfoHydrator>
  );
}

export default DonateDetailLayout;

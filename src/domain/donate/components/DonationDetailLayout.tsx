import { getInitDonationDetail } from "@/domain/donate/api/getInitDonationDetail";
import ImageSwiper from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { queryKeys } from "@/shared/config/queryKeys";
import { donateTabContents } from "@/shared/utils/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { DonateDetailInfo as DonateDetailType } from "../types";
import DonateDetailInfo from "./DonateDetailInfo";

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
  const queryClient = new QueryClient();

  const detailInfo = await queryClient.fetchQuery({
    queryKey: queryKeys.donate.id(id),
    queryFn: () => getInitDonationDetail(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex justify-between pt-4">
        <div className="w-[calc(100%-280px)]">
          <div className="w-full aspect-10/7">
            <ImageSwiper
              slideList={
                detailInfo.data.thumbnailImage
                  ? [{ imageUrl: detailInfo.data.thumbnailImage }]
                  : []
              }
            />
          </div>
          <TabBar type="donate" tabContents={donateTabContents(id)} />
          <main className="py-4">{children}</main>
        </div>
        <DonateDetailInfo id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default DonateDetailLayout;

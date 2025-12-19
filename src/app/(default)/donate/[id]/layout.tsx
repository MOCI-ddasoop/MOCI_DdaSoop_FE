import DetailInfo, { DetailInfoProps } from "@/shared/components/DetailInfo";
import ImageSwiper, { dummyImageList } from "@/shared/components/ImageSwiper";
import TabBar from "@/shared/components/TabBar";
import { donateTabContents } from "@/shared/utils/navigation";

const DETAIL_INFO_DUMMY: DetailInfoProps = {
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
  return (
    <div className="flex justify-between pt-4">
      <div className="w-[calc(100%-280px)]">
        <div className="w-full aspect-10/7">
          <ImageSwiper slideList={dummyImageList} />
        </div>
        <TabBar type="donate" tabContents={donateTabContents(id)} />
        <main className="py-4">{children}</main>
      </div>
      <DetailInfo props={DETAIL_INFO_DUMMY} />
    </div>
  );
}

export default page;

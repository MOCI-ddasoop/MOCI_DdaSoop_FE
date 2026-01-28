import Loading from "@/domain/participation/components/DetailLoadingSkeleton";
import TogetherDetailLayout from "@/domain/participation/components/TogetherDetailLayout";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={<Loading />}>
      <TogetherDetailLayout params={params}>{children}</TogetherDetailLayout>
    </Suspense>
  );
}

export default page;

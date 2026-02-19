import Loading from "@/domain/participation/components/DetailLoadingSkeleton";
import TogetherDetailLayout from "@/domain/together/components/TogetherDetailLayout";
import { Suspense } from "react";

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

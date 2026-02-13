import DonateDetailLayout from "@/domain/donate/components/DonationDetailLayout";
import Loading from "@/domain/participation/components/DetailLoadingSkeleton";
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
      <DonateDetailLayout params={params}>{children}</DonateDetailLayout>
    </Suspense>
  );
}

export default page;

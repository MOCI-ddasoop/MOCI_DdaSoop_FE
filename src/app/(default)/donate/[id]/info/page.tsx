import DonatePayment from "@/domain/donate/components/DonatePayment";
import ClientInfo from "@/domain/participation/components/ClientInfo";
import { Suspense } from "react";

async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
    paymentType?: string;
    paymentKey?: string;
    amount?: string;
  }>;
}) {
  const { id } = await params;
  const paymentParams = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="w-full h-28">
          <div className="loader loader-red" />
        </div>
      }
    >
      <ClientInfo type="donate" id={id} />
      {paymentParams && Object.keys(paymentParams).length !== 0 && (
        <DonatePayment id={id} params={paymentParams} />
      )}
    </Suspense>
  );
}

export default page;

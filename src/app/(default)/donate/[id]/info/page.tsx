import { getDonateDescription } from "@/domain/donate/api/getDonateDescription";
import DonatePayment from "@/domain/donate/components/DonatePayment";

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
  const info = await getDonateDescription(id);

  return (
    <>
      <p
        className={info ? "" : "flex-center text-gray-400"}
        dangerouslySetInnerHTML={{
          __html: info ? info : "후원 소개가 존재하지 않습니다",
        }}
      ></p>
      {paymentParams && Object.keys(paymentParams).length !== 0 && (
        <DonatePayment id={id} params={paymentParams} />
      )}
    </>
  );
}

export default page;

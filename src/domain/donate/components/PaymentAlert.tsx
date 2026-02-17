"use client";
import { useEffect, useState } from "react";
import { usePostPayment } from "../api/usePostPayment";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function PaymentAlert({
  id,
  params,
}: {
  id: string;
  params: {
    code?: string;
    message?: string;
    orderId?: string;
    paymentType?: string;
    paymentKey?: string;
    amount?: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const memberId = useAuthStore((s) => s.me?.memberId);
  const { mutateAsync: tossPayment } = usePostPayment();

  const handlePayment = async () => {
    if (!memberId) return;
    console.log(params.code);
    if (!params.code) {
      try {
        await tossPayment({
          donationId: id,
          memberId,
          paymentKey: params.paymentKey!,
          orderId: params.orderId!,
          amount: params.amount!,
        });
      } catch (error) {
        setIsOpen(false);
        alert("결제 중 오류가 발생했습니다. 다시 시도해주세요");
      } finally {
        setIsOpen(false);
        router.replace(`/donate/${id}/info`);
      }
    }
  };

  useEffect(() => {
    if (!params.code) {
      handlePayment();
    }
  }, []);

  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="flex justify-center gap-3 flex-col max-w-lg w-1/2 h-fit bg-white rounded-md pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="w-full py-4 border-b-2 border-b-mainred text-center text-lg font-semibold">
            후원하기 결제
          </h1>
          <p className="px-10 text-gray-500">{`결제번호 : ${params.orderId}`}</p>
          {params.code ? (
            <>
              <p className="px-10">{`오류코드 : ${params.code}`}</p>
              <p className="px-10">{`${params.message}`}</p>
            </>
          ) : (
            <>
              <p className="px-10">
                결제금액 :
                <span className="text-lg font-medium text-mainred">
                  {" "}
                  {params.amount}원
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    )
  );
}

export default PaymentAlert;

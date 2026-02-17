"use client";

import Button from "@/shared/components/Button";
import { useState } from "react";
import { usePostPayment } from "../api/usePostPayment";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

function PaymentModal({
  id,
  params,
}: {
  id: string;
  params: {
    paymentType: string;
    paymentKey: string;
    amount: string;
    orderId: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { mutate: postPayment } = usePostPayment();
  const { paymentKey, amount, orderId } = params;
  const memberId = useAuthStore((s) => s.me?.memberId);
  if (!memberId) return;

  const handlePaymentAPI = () => {
    postPayment({
      donationId: id,
      paymentKey,
      orderId,
      amount,
      memberId,
    });
    router.replace(`/donate/${id}/info`);
    setIsOpen(false);
  };
  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="flex flex-col max-w-lg w-fit h-fit bg-white rounded-md gap-2 px-5 pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="w-full py-4 border-b-2 border-b-mainred text-center text-lg font-semibold">
            결제성공
          </h1>
          <p className="shrink-0 text-gray-500 text-sm">
            결제번호 : {params.orderId}
          </p>
          <p className="font-medium shrink-0 text-sm">
            결제금액 : {params.amount}원
          </p>
          <Button
            color="red"
            className="w-60 self-center pt-3"
            onClick={handlePaymentAPI}
          >
            확인
          </Button>
        </div>
      </div>
    )
  );
}

export default PaymentModal;

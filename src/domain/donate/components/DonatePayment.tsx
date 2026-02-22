"use client";
import { useEffect } from "react";
import { usePostPayment } from "../api/usePostPayment";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

function DonatePayment({
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
  const { mutateAsync: donationPayment } = usePostPayment();
  const memberId = useAuthStore((s) => s.me?.memberId);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const paymentRequest = async () => {
      if (!memberId) return;
      if (params.paymentKey && params.orderId && params.amount) {
        try {
          await donationPayment({
            donationId: id,
            memberId,
            paymentKey: params.paymentKey,
            orderId: params.orderId,
            amount: params.amount,
          });
        } catch (e) {
          alert("결제 승인에 실패했습니다 다시 시도해주세요");
        }
      } else {
        alert("결제 승인에 실패했습니다 다시 시도해주세요");
      }
      queryClient.refetchQueries({ queryKey: queryKeys.donate.id(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.donate.history(id) });
      router.replace(`/donate/${id}`);
    };
    paymentRequest();
  }, [
    donationPayment,
    id,
    memberId,
    params.amount,
    params.orderId,
    params.paymentKey,
    queryClient,
    router,
  ]);
  return <></>;
}

export default DonatePayment;

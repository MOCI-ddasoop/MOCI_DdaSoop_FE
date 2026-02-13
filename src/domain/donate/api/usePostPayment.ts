import { api } from "@/shared/config/api";
import { useMutation } from "@tanstack/react-query";

export const usePostPayment = () => {
  return useMutation({
    mutationFn: async ({
      donationId,
      memberId,
      paymentKey,
      orderId,
      amount,
    }: {
      donationId: string;
      memberId: number;
      paymentKey: string;
      orderId: string;
      amount: number;
    }) => {
      const { data } = await api.post(
        `api/v1/donation/toss/${donationId}/pay`,
        { paymentKey, orderId, amount, memberId },
      );
      return data;
    },
  });
};

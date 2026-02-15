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
      amount: string;
    }) => {
      const payInfo = { paymentKey, orderId, amount, memberId };
      const { data } = await api.post(
        `/api/v1/donation/toss/${donationId}/pay`,
        payInfo,
      );
      return data;
    },
  });
};

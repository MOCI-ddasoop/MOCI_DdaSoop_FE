"use client";
// import { DONATION_LIST } from "@/shared/mock/mockup";
import DonationListItem from "./DonationListItem";
import { useGetDonationHistory } from "../api/useGetDonationHistory";

function DonationHistoryContainer({ id }: { id: string }) {
  const { data: DONATION_LIST, isPending, isError } = useGetDonationHistory(id);
  return (
    <div
      className={`w-full ${isError || isPending || DONATION_LIST.data.length === 0 ? "flex-center" : "grid lg:grid-cols-2 xl:grid-cols-3 gap-6"}`}
    >
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : DONATION_LIST.data.length === 0 ? (
        <p className="text-gray-400">기부 내역이 없습니다</p>
      ) : (
        DONATION_LIST.data.map(
          ({ donationPaymentId, memberName, amount, createdAt }) => (
            <DonationListItem
              key={donationPaymentId}
              name={memberName!}
              userName={memberName!}
              amount={amount!}
              // donationIImage 추가필요
              createdAt={createdAt?.slice(0, 10)}
            />
          ),
        )
      )}
    </div>
  );
}

export default DonationHistoryContainer;

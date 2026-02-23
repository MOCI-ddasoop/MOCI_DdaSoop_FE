"use client";
import { useAuthStore } from "@/store/authStore";
import { useGetOwnDonationHistory } from "../api/useGetOwnDonationHistory";
import DonationListItem from "./DonationListItem";

function MyDonateHistory() {
  const userId = useAuthStore((s) => s.me?.memberId);
  const { isError, isPending, data: items } = useGetOwnDonationHistory(userId!);
  return (
    <>
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : (
        items && (
          <div
            className={`w-full ${isError || isPending || items.data.length === 0 ? "flex-center" : "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}`}
          >
            {items.data.map(
              ({
                id,
                donationId,
                title,
                thumbnailImage,
                amount,
                createdAt,
              }) => (
                <DonationListItem
                  key={id}
                  name={title!}
                  amount={amount!}
                  donationImage={thumbnailImage}
                  createdAt={createdAt?.slice(0, 10)}
                  href={`/donate/${donationId}`}
                  type="mypage"
                />
              ),
            )}
          </div>
        )
      )}
      {/* {items && <Pagination totalPages={items?.data.totalPages ?? 0} />} */}
    </>
  );
}

export default MyDonateHistory;

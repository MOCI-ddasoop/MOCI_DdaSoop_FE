import DonationListItem from "@/domain/donate/components/DonationListItem";
import { RecentDonationPaymentListResponse } from "@/domain/donate/types";
import Link from "next/link";

function DonationList({
  items,
}: {
  items: RecentDonationPaymentListResponse[];
}) {
  return (
    <div className="w-62 h-fit p-3 shadow-md rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3>
          <span className="text-mainred font-medium">최신순 </span>
          후원내역
        </h3>
        <Link
          href="/donate"
          className="text-sm hover:underline hover:underline-offset-2"
        >
          더보기
        </Link>
      </div>
      {items.map(
        ({
          id,
          donationId,
          memberId,
          memberName,
          title,
          thumbnailImage,
          amount,
          paymentMethod,
          createdAt,
        }) => (
          <DonationListItem
            key={id}
            name={title!}
            userName={memberName}
            amount={amount!}
            donationImage={thumbnailImage}
            createdAt={createdAt?.slice(0, 10)}
            type="summary"
            href={`/donate/${donationId}`}
          />
        ),
      )}
    </div>
  );
}

export default DonationList;

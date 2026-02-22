import DonationListItem from "@/domain/donate/components/DonationListItem";
import { DonationListItemProps } from "@/domain/donate/types";
import Link from "next/link";

function DonationList({ items }: { items: DonationListItemProps[] }) {
  return (
    <div className="w-62 h-fit p-3 shadow-md rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3>후원하기</h3>
        <Link
          href="/donate"
          className="text-sm hover:underline hover:underline-offset-2"
        >
          더보기
        </Link>
      </div>
      {items.map(({ name, userName, amount, donationImage, href }, i) => (
        <DonationListItem
          key={i}
          name={name}
          userName={userName}
          amount={amount}
          donationImage={donationImage}
          href={href}
        />
      ))}
    </div>
  );
}

export default DonationList;

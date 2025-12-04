import DonationListItem, {
  DonationListItemProps,
} from "@/shared/components/DonationListItem";
import Link from "next/link";

function DonationList({ donations }: { donations: DonationListItemProps[] }) {
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
      {donations.map(
        ({ id, name, userName, amount, donationImage, href }, index) => (
          <DonationListItem
            key={id}
            id={id}
            name={name}
            userName={userName}
            amount={amount}
            donationImage={donationImage}
            href={href}
          />
        )
      )}
    </div>
  );
}

export default DonationList;

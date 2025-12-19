import DonationListItem from "@/shared/components/DonationListItem";
import { DONATION_LIST } from "@/shared/mock/mockup";

function DonationHistoryContainer() {
  return (
    <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
      {DONATION_LIST.map(
        ({ id, name, userName, amount, donationImage, href }) => (
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

export default DonationHistoryContainer;

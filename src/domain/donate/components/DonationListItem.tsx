import Image from "next/image";
import Link from "next/link";
import { DonationListItemProps } from "../types";
import { formatMoney } from "../utils/formatMoney";

function DonationListItem({
  id,
  donationImage,
  name,
  amount,
  userName,
  href,
}: DonationListItemProps) {
  const content = (
    <>
      <div className="shrink-0 relative w-12 h-12 rounded-full overflow-hidden border border-gray-300">
        <Image src={donationImage} alt={name} fill />
      </div>
      <div className="w-38 flex-1 flex gap-0.5 flex-col">
        <p className="text-sm truncate">{name}</p>
        <div className=" font-medium flex justify-between align-center">
          <p className="flex-1 truncate">{userName}</p>
          <p className="font-semibold text-mainred">{formatMoney(amount)}</p>원
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="min-w-56 xl:max-w-56 w-full h-16 p-2 flex gap-2 bg-white ring ring-pastelblue rounded-lg hover:bg-gray-100 hover:shadow transition-all"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="min-w-56 xl:max-w-56 w-full  h-16 p-2 flex gap-2 bg-white ring ring-pastelblue rounded-lg">
      {content}
    </div>
  );
}

export default DonationListItem;

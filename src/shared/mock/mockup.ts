import { DonationListItemProps } from "../components/DonationListItem";
import { TogetherListItemProps } from "../components/TogetherListItem";

export const CARD_DATA = Array.from({ length: 20 }).map((_, index) => ({
  id: index,
  src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
  alt: "test",
  width: Math.floor(Math.random() * 500) + 100,
  height: Math.floor(Math.random() * 1000) + 100,
}));

export const TOGETHER_LIST: TogetherListItemProps[] = Array.from({
  length: 2,
}).map((_, index) => ({
  id: `together-${index}`,
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
  name: "Together 1",
  category: "category 1",
  isOnline: "online",
  href: "/together/1",
}));

export const DONATION_LIST: DonationListItemProps[] = Array.from({
  length: 2,
}).map((_, index) => ({
  id: `donation-${index}`,
  donationImage:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
  name: "Donation 1",
  amount: 10000,
  userName: "user 1",
  href: "/donation/1",
}));

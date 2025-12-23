import { DonationListItemProps } from "../components/DonationListItem";
import { TogetherListItemProps } from "../components/TogetherListItem";

export type CardDataType = {
	id: number;
	src: string;
	alt: string;
	width: number;
	height: number;
};

export const CARD_DATA = Array.from({ length: 20 }).map((_, index) => ({
	id: index,
	src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
	alt: "test",
	width: Math.floor(Math.random() * 500) + 100,
	height: Math.floor(Math.random() * 1000) + 100,
}));

export async function fetchMockFeeds(cursor: number | null, limit: number) {
	let startIndex = 0;

	if (cursor !== null) {
		const idx = CARD_DATA.findIndex((f) => f.id === cursor);
		startIndex = idx + 1;
	}

	const items = CARD_DATA.slice(startIndex, startIndex + limit);
	const lastItem = items[items.length - 1];

	return {
		items,
		nextCursor: lastItem ? lastItem.id : null,
	};
}

export const TOGETHER_LIST: TogetherListItemProps[] = Array.from({
	length: 2,
}).map((_, index) => ({
	id: index,
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
	id: index,
	donationImage:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
	name: "Donation 1",
	amount: 10000,
	userName: "user 1",
	href: "/donation/1",
}));

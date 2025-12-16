export type MOCK_FEED = {
	id: number;
	src: string;
	alt: string;
	width: number;
	height: number;
};

//임시 mock DB
export const MOCK_FEED = Array.from({ length: 200 }).map((_, i) => ({
	id: i,
	src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
	alt: "test",
	width: Math.floor(Math.random() * 500) + 100,
	height: Math.floor(Math.random() * 1000) + 100,
}));

export async function fetchMockFeeds(cursor: number | null, limit: number) {
	let startIndex = 0;

	if (cursor !== null) {
		const idx = MOCK_FEED.findIndex((f) => f.id === cursor);
		startIndex = idx + 1;
	}

	const items = MOCK_FEED.slice(startIndex, startIndex + limit);
	const lastItem = items[items.length - 1];

	return {
		items,
		nextCursor: lastItem ? lastItem.id : null,
	};
}

export const mockFeeds = [
	{
		id: 1,
		src: "https://source.unsplash.com/random/1",
		width: 1080,
		height: 720,
	},
	{
		id: 2,
		src: "https://source.unsplash.com/random/2",
		width: 720,
		height: 1080,
	},
	{
		id: 3,
		src: "https://source.unsplash.com/random/3",
		width: 1200,
		height: 800,
	},
	{
		id: 4,
		src: "https://source.unsplash.com/random/4",
		width: 800,
		height: 1200,
	},
	{
		id: 5,
		src: "https://source.unsplash.com/random/5",
		width: 900,
		height: 1350,
	},
	{
		id: 6,
		src: "https://source.unsplash.com/random/6",
		width: 1600,
		height: 900,
	},
	{
		id: 7,
		src: "https://source.unsplash.com/random/7",
		width: 1080,
		height: 1350,
	},
	{
		id: 8,
		src: "https://source.unsplash.com/random/8",
		width: 1200,
		height: 630,
	},
	{
		id: 9,
		src: "https://source.unsplash.com/random/9",
		width: 640,
		height: 960,
	},
	{
		id: 10,
		src: "https://source.unsplash.com/random/10",
		width: 1920,
		height: 1280,
	},

	{
		id: 11,
		src: "https://source.unsplash.com/random/11",
		width: 960,
		height: 640,
	},
	{
		id: 12,
		src: "https://source.unsplash.com/random/12",
		width: 1000,
		height: 1500,
	},
	{
		id: 13,
		src: "https://source.unsplash.com/random/13",
		width: 1280,
		height: 720,
	},
	{
		id: 14,
		src: "https://source.unsplash.com/random/14",
		width: 900,
		height: 900,
	},
	{
		id: 15,
		src: "https://source.unsplash.com/random/15",
		width: 1080,
		height: 1620,
	},
	{
		id: 16,
		src: "https://source.unsplash.com/random/16",
		width: 1200,
		height: 1800,
	},
	{
		id: 17,
		src: "https://source.unsplash.com/random/17",
		width: 800,
		height: 600,
	},
	{
		id: 18,
		src: "https://source.unsplash.com/random/18",
		width: 600,
		height: 800,
	},
	{
		id: 19,
		src: "https://source.unsplash.com/random/19",
		width: 1400,
		height: 1000,
	},
	{
		id: 20,
		src: "https://source.unsplash.com/random/20",
		width: 1000,
		height: 700,
	},

	{
		id: 21,
		src: "https://source.unsplash.com/random/21",
		width: 900,
		height: 1600,
	},
	{
		id: 22,
		src: "https://source.unsplash.com/random/22",
		width: 1600,
		height: 900,
	},
	{
		id: 23,
		src: "https://source.unsplash.com/random/23",
		width: 700,
		height: 1100,
	},
	{
		id: 24,
		src: "https://source.unsplash.com/random/24",
		width: 1200,
		height: 700,
	},
	{
		id: 25,
		src: "https://source.unsplash.com/random/25",
		width: 800,
		height: 1300,
	},
	{
		id: 26,
		src: "https://source.unsplash.com/random/26",
		width: 1350,
		height: 900,
	},
	{
		id: 27,
		src: "https://source.unsplash.com/random/27",
		width: 1100,
		height: 1400,
	},
	{
		id: 28,
		src: "https://source.unsplash.com/random/28",
		width: 900,
		height: 1800,
	},
	{
		id: 29,
		src: "https://source.unsplash.com/random/29",
		width: 1600,
		height: 1200,
	},
	{
		id: 30,
		src: "https://source.unsplash.com/random/30",
		width: 1000,
		height: 1000,
	},

	{
		id: 31,
		src: "https://source.unsplash.com/random/31",
		width: 600,
		height: 1000,
	},
	{
		id: 32,
		src: "https://source.unsplash.com/random/32",
		width: 1000,
		height: 600,
	},
	{
		id: 33,
		src: "https://source.unsplash.com/random/33",
		width: 900,
		height: 1200,
	},
	{
		id: 34,
		src: "https://source.unsplash.com/random/34",
		width: 1400,
		height: 2000,
	},
	{
		id: 35,
		src: "https://source.unsplash.com/random/35",
		width: 2000,
		height: 1400,
	},
	{
		id: 36,
		src: "https://source.unsplash.com/random/36",
		width: 1100,
		height: 900,
	},
	{
		id: 37,
		src: "https://source.unsplash.com/random/37",
		width: 900,
		height: 1100,
	},
	{
		id: 38,
		src: "https://source.unsplash.com/random/38",
		width: 1300,
		height: 900,
	},
	{
		id: 39,
		src: "https://source.unsplash.com/random/39",
		width: 1500,
		height: 1000,
	},
	{
		id: 40,
		src: "https://source.unsplash.com/random/40",
		width: 800,
		height: 2000,
	},

	{
		id: 41,
		src: "https://source.unsplash.com/random/41",
		width: 1080,
		height: 720,
	},
	{
		id: 42,
		src: "https://source.unsplash.com/random/42",
		width: 720,
		height: 1080,
	},
	{
		id: 43,
		src: "https://source.unsplash.com/random/43",
		width: 900,
		height: 1350,
	},
	{
		id: 44,
		src: "https://source.unsplash.com/random/44",
		width: 1350,
		height: 900,
	},
	{
		id: 45,
		src: "https://source.unsplash.com/random/45",
		width: 1800,
		height: 1200,
	},
	{
		id: 46,
		src: "https://source.unsplash.com/random/46",
		width: 1600,
		height: 2400,
	},
	{
		id: 47,
		src: "https://source.unsplash.com/random/47",
		width: 2400,
		height: 1600,
	},
	{
		id: 48,
		src: "https: //source.unsplash.com/random/48",
		width: 800,
		height: 600,
	},
	{
		id: 49,
		src: "https://source.unsplash.com/random/49",
		width: 600,
		height: 900,
	},
	{
		id: 50,
		src: "https://source.unsplash.com/random/50",
		width: 900,
		height: 600,
	},
];

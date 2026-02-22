"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FeedCardImage from "./FeedCardImage";
import tw from "@/shared/utils/tw";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { throttle } from "@/shared/utils/throttle";
import {
	InfiniteFeedParams,
	useGetInfiniteFeedList,
} from "../api/useGetInfiniteFeedList";
import { FeedInfinite } from "../types";
import { preloadAndDecode } from "../utils/imageDecodeCache";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/domain/modal/store/useModalStore";

export type PositionedItem = FeedInfinite & {
	width: number;
	height: number;
	x: number;
	y: number;
};

function FeedCardContainer({
	className,
	pageName,
	queryParams,
	notice = false,
	bookmark = false,
}: {
	className?: string;
	pageName?: "together" | "member";
	queryParams?: string;
	notice?: boolean;
	bookmark?: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const openStoreModal = useModalStore((store) => store.open);

	const [containerWidth, setContainerWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const memberId = useAuthStore((state) => state.me?.memberId);

	const infiniteParams: InfiniteFeedParams = (() => {
		if (pageName === "together") {
			return {
				page: "together",
				togetherId: Number(queryParams),
				notice,
			};
		}

		if (pageName === "member") {
			return {
				page: "member",
				memberId: memberId!,
				bookmark,
			};
		}
		return {};
	})();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isPending,
	} = useGetInfiniteFeedList(infiniteParams);
	//무한스크롤 target ref
	const triggerRef = useIntersection({
		onIntersect: () => {
			fetchNextPage();
		},
		hasNextPage,
		isFetching,
	});

	const MIN_ITEM_HEIGHT = 150;

	const throttledSetWidth = useMemo(
		() =>
			throttle((width: unknown) => {
				if (typeof width !== "number") return;

				setContainerWidth(width);
			}, 100), // 100ms throttle for smoother updates
		[],
	);

	// 컨테이너 너비 측정
	useEffect(() => {
		if (!containerRef.current) return;

		// 초기 너비 설정
		setContainerWidth(containerRef.current.clientWidth);

		const resizeObserver = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect?.width;
			if (width) {
				throttledSetWidth(width);
			}
		});

		resizeObserver.observe(containerRef.current);
		return () => {
			resizeObserver.disconnect();
		};
	}, [throttledSetWidth]);

	// 반응형 컬럼 개수
	const columnCount = useMemo(() => {
		if (containerWidth >= 1024) return 5;
		if (containerWidth >= 768) return 4;
		if (containerWidth >= 640) return 3;
		return 2;
	}, [containerWidth]);

	const items: FeedInfinite[] = useMemo(
		() =>
			notice
				? (data?.pages.flatMap((p) => p) ?? [])
				: (data?.pages.flatMap((p) => p.content) ?? []),
		[data, notice],
	);

	const positionedItems = useMemo(() => {
		if (containerWidth === 0) return [];

		// 간격 계산
		const gap = 16;
		// 아이템 너비 계산
		const itemWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
		// 컬럼 높이 초기화
		const currentColumnHeights = new Array(columnCount).fill(0);

		return items.map((item) => {
			if (!item.thumbnailUrl || !item.thumbnailWidth || !item.thumbnailHeight) {
				item.thumbnailUrl = "/defaultFeedImage.png";
				item.thumbnailHeight = MIN_ITEM_HEIGHT;
				item.thumbnailWidth = MIN_ITEM_HEIGHT;
			}
			const aspectRatio = item.thumbnailWidth / item.thumbnailHeight;
			const itemHeight = Math.max(itemWidth / aspectRatio, MIN_ITEM_HEIGHT);

			// 가장 짧은 컬럼 찾기
			const shortestColumnIndex = currentColumnHeights.indexOf(
				Math.min(...currentColumnHeights),
			);

			// 위치 계산
			const x = shortestColumnIndex * (itemWidth + gap);
			const y = currentColumnHeights[shortestColumnIndex];

			// 컬럼 높이 업데이트
			currentColumnHeights[shortestColumnIndex] += itemHeight + gap;

			return {
				...item,
				width: itemWidth,
				height: itemHeight,
				x,
				y,
			};
		});
	}, [containerWidth, columnCount, items]);

	// 컨테이너 높이 계산
	const containerHeight = useMemo(() => {
		if (positionedItems.length === 0) return 0;
		return Math.max(...positionedItems.map((item) => item.y + item.height));
	}, [positionedItems]);

	// 가장 짧은 컬럼 높이 계산
	const shortestColumnHeight = useMemo(() => {
		if (positionedItems.length === 0) return 0;
		return Math.min(...positionedItems.map((item) => item.y + item.height));
	}, [positionedItems]);

	// 커스텀 버츄얼 스크롤
	const [visibleItems, setVisibleItems] = useState<PositionedItem[]>([]);
	const positionsItemsRef = useRef(positionedItems);

	const onScrollRef = useRef(() => {
		const viewportTop = window.scrollY;
		const viewportBottom = viewportTop + window.innerHeight;
		const OVERSCAN = 300;
		const filteredItems = positionsItemsRef.current.filter(
			(item) =>
				item.y + item.height >= viewportTop - OVERSCAN &&
				item.y <= viewportBottom + OVERSCAN,
		);
		setVisibleItems(filteredItems);

		// decode
		const DECODE_OFFSET = 600;
		const decodeItems = positionsItemsRef.current.filter(
			(item) =>
				item.y + item.height >= viewportTop - DECODE_OFFSET &&
				item.y <= viewportBottom + DECODE_OFFSET,
		);

		decodeItems.forEach((i) => {
			if (i.thumbnailUrl) {
				preloadAndDecode(i.thumbnailUrl);
			}
		});
	});

	useEffect(() => {
		positionsItemsRef.current = positionedItems;
		onScrollRef.current();
	}, [positionedItems, onScrollRef]);

	useEffect(() => {
		const scrollHandler = onScrollRef.current;
		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	}, [onScrollRef]);

	return (
		<div className="flex flex-col w-full">
			<div
				ref={containerRef}
				className={tw("relative w-full", className)}
				style={{ height: containerHeight || "auto" }}
			>
				{visibleItems.map((item) => {
					if (item.id)
						return (
							<FeedCardImage
								item={item}
								key={item.id}
								alt={item.thumbnailUrl ?? "따숲"}
								onClick={() => {
									const params = new URLSearchParams(searchParams.toString());
									params.set("feedId", (item.id ?? "").toString());
									router.push(`${pathname}?${params.toString()}`, {
										scroll: false,
									});
									openStoreModal("feed");
								}}
								className="duration-300 ease-in-out absolute"
							/>
						);
				})}
			</div>

			<div
				ref={triggerRef}
				className="h-20 absolute"
				style={{ marginTop: `${containerHeight - shortestColumnHeight}px` }}
			/>
			{isPending && (
				<div className="h-28 flex-center">
					<div className="loader"></div>
				</div>
			)}
			{isFetchingNextPage && (
				<div className="h-8 flex-center">
					<div className="loader"></div>
				</div>
			)}
			{!isPending && !hasNextPage && (
				<div className="text-gray-400 flex-center">
					모든 데이터를 불러왔습니다
				</div>
			)}
		</div>
	);
}

export default FeedCardContainer;

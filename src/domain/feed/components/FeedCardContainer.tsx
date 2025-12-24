"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FeedCardImage from "./FeedCardImage";
import FeedModal from "./FeedModal";
import tw from "@/shared/utils/tw";
import { CardDataType, fetchMockFeeds } from "@/shared/mock/mockup";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { throttle } from "@/shared/utils/throttle";

type PositionedItems = Partial<Feed> & {
	src: string;
	alt: string;
	width: number;
	height: number;
	x: number;
	y: number;
};

function FeedCardContainer({
	className,
	queryParams,
}: {
	className?: string;
	queryParams?: string;
}) {
	const [feedId, setFeedId] = useState<number | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	//무한스크롤
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["feeds"],
			queryFn: ({ pageParam }) => fetchMockFeeds(pageParam, 15),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: 1,
		});
	//무한스크롤 target ref
	const bottomRef = useIntersection(() => {
		fetchNextPage();
	}, hasNextPage);

	const throttledSetWidth = useMemo(
		() =>
			throttle((width: unknown) => {
				if (typeof width !== "number") return;

				setContainerWidth(width);
			}, 100), // 100ms throttle for smoother updates
		[]
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
	}, []);

	// 반응형 컬럼 개수
	const columnCount = useMemo(() => {
		if (containerWidth >= 1024) return 5;
		if (containerWidth >= 768) return 4;
		if (containerWidth >= 640) return 3;
		return 2;
	}, [containerWidth]);

	const items: CardDataType[] = useMemo(
		() => data?.pages.flatMap((p) => p.items) ?? [],
		[data]
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
			const aspectRatio = item.width / item.height;
			const itemHeight = Math.min(itemWidth / aspectRatio, 500);

			// 가장 짧은 컬럼 찾기
			const shortestColumnIndex = currentColumnHeights.indexOf(
				Math.min(...currentColumnHeights)
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

	// 커스텀 버츄얼 스크롤
	const [visibleItems, setVisibleItems] = useState<PositionedItems[]>([]);
	const positionsItemsRef = useRef(positionedItems);

	const onScroll = useCallback(() => {
		const viewportTop = window.scrollY;
		const viewportBottom = viewportTop + window.innerHeight;
		const OVERSCAN = 200;
		const filteredItems = positionsItemsRef.current.filter(
			(item) =>
				item.y + item.height >= viewportTop - OVERSCAN &&
				item.y <= viewportBottom + OVERSCAN
		);
		setVisibleItems(filteredItems);
	}, [positionsItemsRef]);

	useEffect(() => {
		positionsItemsRef.current = positionedItems;
		onScroll();
	}, [positionedItems, onScroll]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [onScroll]);

	return (
		<>
			<div
				ref={containerRef}
				className={tw("relative w-full", className)}
				style={{ height: containerHeight || "auto" }}
			>
				{visibleItems.map((item) => {
					if (item.id)
						return (
							<FeedCardImage
								id={item.id}
								key={item.id}
								src={item.src}
								alt={item.alt}
								width={item.width}
								imageWidth={item.width}
								imageHeight={item.height}
								x={item.x}
								y={item.y}
								onClick={() => setFeedId(item.id ?? null)}
								className="duration-300 ease-in-out absolute"
							/>
						);
				})}
			</div>
			<FeedModal
				feedId={feedId?.toString() || ""}
				onClose={() => setFeedId(null)}
				isOpen={feedId !== null}
			/>

			<div ref={bottomRef} className="h-20 bg-cyan-400" />
			{isFetchingNextPage && <div>불러오는 중...</div>}
			{!hasNextPage && (
				<div className="text-gray-400">모든 데이터를 불러왔습니다</div>
			)}
		</>
	);
}

export default FeedCardContainer;

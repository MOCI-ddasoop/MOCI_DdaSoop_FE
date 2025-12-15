"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CardImage from "./CardImage";
import FeedModal from "./FeedModal";
import tw from "@/shared/utils/tw";
import { throttle } from "@/shared/utils/throttle";
import { CARD_DATA } from "@/shared/mock/mockup";

function CardContainer({
  className,
  queryParams,
}: {
  className?: string;
  queryParams?: string;
}) {
  const [feedId, setFeedId] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSetWidthRef = useRef(
    throttle((width: unknown) => {
      if (typeof width !== "number") return;

      setContainerWidth(width);
    }, 200)
  );

  // 컨테이너 너비 측정
  useEffect(() => {
    if (!containerRef.current) return;

    // 초기 너비 설정
    setContainerWidth(containerRef.current.clientWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      debouncedSetWidthRef.current(entries[0].contentRect.width);
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

  const positionedItems = useMemo(() => {
    if (containerWidth === 0) return [];

    // 간격 계산
    const gap = 16;
    // 아이템 너비 계산
    const itemWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
    // 컬럼 높이 초기화
    const currentColumnHeights = new Array(columnCount).fill(0);

    return CARD_DATA.map((item) => {
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
  }, [containerWidth, columnCount]);

  // 컨테이너 높이 계산
  const containerHeight = useMemo(() => {
    if (positionedItems.length === 0) return 0;
    return Math.max(...positionedItems.map((item) => item.y + item.height));
  }, [positionedItems]);

  return (
    <>
      <div
        ref={containerRef}
        className={tw("relative w-full", className)}
        style={{ height: containerHeight || "auto" }}
      >
        {positionedItems.map((item) => (
          <CardImage
            key={item.id}
            src={item.src}
            alt={item.alt}
            width={item.width}
            imageWidth={item.width}
            imageHeight={item.height}
            x={item.x}
            y={item.y}
            onClick={() => setFeedId(item.id)}
            className="duration-300 ease-in-out"
          />
        ))}
      </div>
      <FeedModal
        feedId={feedId?.toString() || "0"}
        onClose={() => setFeedId(null)}
        isOpen={feedId !== null}
      />
    </>
  );
}

export default CardContainer;

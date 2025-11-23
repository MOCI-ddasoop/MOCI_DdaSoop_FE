"use client";

import { useState } from "react";
import CardImage from "./CardImage";
import FeedModal from "./FeedModal";


const CARD_DATA = Array.from({ length: 20 }).map((_, index) => ({
  id: index,
  src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
  alt: "test",
}));

// 아이템들 간에 높낮이가 다르게 하고 싶다면 세로축 정렬로 세워야 할 듯함. 현재는 가로축 정렬
// 그런데 이 경우에는 반응형 작업을 하게 되면 연관성 높은 아이템을 보여 주는 데 문제가 발생(정렬 문제)
// 그럼 정렬방식을 두개를 만들고 화면 크기에 따라 렌더링되는 컴포넌트를 변경하는 게 나을 수도 있음
// 브라우저 캐싱이 작동할 것이기 때문에 다운로드 부담은 거의 없을 것으로 예상

// 아이템 개수 기반의 문제점
// 각각 아이템의 높이가 다른데, 순서대로 출력하려고 할 때 1,6,11 위치 아이템들이 높이가 낮다면?
// 높이 구성이 망가짐

// 연관성 상관 없이 높이 기반 batch로 아이템을 출력해야 함.
// 기존 구현 계획처럼 서버에서 width, height를 받아올 수 있다면 메타데이터 이용
// 서버에서 w/h를 받아올 수 없다면 batch 단위를 임의로 선택해야 함. << 이 경우는 배치 책임이 container에 있어야 함.

function CardContainer() {
  const [feedId, setFeedId] = useState<number | null>(null);

  // TODO: 데이터 조회 로직 추가

  const handleClick = (id: number) => {
    setFeedId(id);
    console.log(id);
  };

  return (
    <div className="w-fit grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {CARD_DATA.map((item) => (
        <CardImage
          key={item.id}
          src={item.src}
          alt={item.alt}
          className="w-44 h-95"
          onClick={() => setFeedId(item.id)}
        />
      ))}
      <FeedModal
        feedId={feedId?.toString() || "0"}
        onClose={() => setFeedId(null)}
        isOpen={feedId !== null}
      />
    </div>
  );
}
export default CardContainer;

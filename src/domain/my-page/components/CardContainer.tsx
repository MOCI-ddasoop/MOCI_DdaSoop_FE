"use client";

import { useState } from "react";
import CardImage from "./CardImage";
import FeedModal from "./FeedModal";

interface CardContainerProps {
  data: {
    id: number;
    src: string;
    alt: string;
  }[];
}

// 아이템들 간에 높낮이가 다르게 하고 싶다면 세로축 정렬로 세워야 할 듯함. 현재는 가로축 정렬
// 그런데 이 경우에는 반응형 작업을 하게 되면 연관성 높은 아이템을 보여 주는 데 문제가 발생(정렬 문제)
// 흠...
// 그럼 정렬방식을 두개를 만들고 화면 크기에 따라 렌더링되는 컴포넌트를 변경하는 게 나을 수도 있음
// 브라우저 캐싱이 작동할 것이기 때문에 다운로드 부담은 거의 없을 것으로 예상

function CardContainer({ data }: CardContainerProps) {
  const [feedId, setFeedId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setFeedId(id);
    console.log(id);
  };

  return (
    <div className="w-fit grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data.map((item) => (
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

import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { TogetherInfo } from "@/domain/together/types";
import { categoryType, isOnlineType } from "@/shared/constants/filter";
import Link from "next/link";

function TogetherList({
  items,
  type,
}: {
  items: TogetherInfo[];
  type: string;
}) {
  return (
    <div className="w-62 h-fit p-3 shadow-md rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3>
          <span className="text-mainblue font-medium">{type}</span> 함께하기
        </h3>
        <Link
          href="/together"
          className="text-sm hover:underline hover:underline-offset-2"
        >
          더보기
        </Link>
      </div>
      {items.map(({ id, thumbnailImage, title, category, mode }) => (
        <TogetherListItem
          key={id}
          id={id}
          image={thumbnailImage ?? "/defaultFeedImage.png"}
          name={title}
          category={categoryType[category]}
          isOnline={isOnlineType[mode]}
          href={`/together/${id}`}
        />
      ))}
    </div>
  );
}

export default TogetherList;

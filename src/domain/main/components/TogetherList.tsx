import TogetherListItem from "@/domain/together/components/TogetherListItem";
import { TogetherListItemProps } from "@/domain/together/types";
import Link from "next/link";

function TogetherList({ items }: { items: TogetherListItemProps[] }) {
  return (
    <div className="w-62 h-fit p-3 shadow-md rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3>함께하기</h3>
        <Link
          href="/together"
          className="text-sm hover:underline hover:underline-offset-2"
        >
          더보기
        </Link>
      </div>
      {items.map(({ id, image, name, category, isOnline, href }) => (
        <TogetherListItem
          key={id}
          id={id}
          image={image}
          name={name}
          category={category}
          isOnline={isOnline}
          href={href}
        />
      ))}
    </div>
  );
}

export default TogetherList;

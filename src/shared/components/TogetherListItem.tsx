import Link from "next/link";
import Image from "next/image";
import Capsule from "./Capsule";

// 카테고리, 온/오프라인, 모집중/모집완료 ->  타입지정해도 좋을듯
export interface TogetherListItemProps {
  id: string;
  image: string;
  name: string;
  category: string;
  isOnline: string;
  href: string;
}

function TogetherListItem({
  id,
  image,
  name,
  category,
  isOnline,
  href,
}: TogetherListItemProps) {
  return (
    <Link
      href={href}
      className="w-56 h-fit p-2 flex items-center gap-2 bg-white ring ring-pastelblue rounded-lg hover:bg-gray-100 hover:shadow transition-all"
    >
      <div className="shrink-0 relative w-12 h-12 rounded-full overflow-hidden border border-gray-300">
        <Image src={image} alt={name} fill />
      </div>
      <div className="w-38 flex-1 flex gap-2 flex-col">
        <p className="font-medium truncate">{name}</p>
        <div className="flex flex-wrap justify-baseline align-center gap-2">
          <Capsule
            text={category}
            type="category"
            readOnly
            className="text-xs font-normal"
          />
          <Capsule
            text={isOnline}
            type="isOnline"
            readOnly
            className="text-xs font-normal"
          />
        </div>
      </div>
    </Link>
  );
}

export default TogetherListItem;

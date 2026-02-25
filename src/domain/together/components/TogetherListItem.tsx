"use client";

import Image from "next/image";
import Capsule from "@/shared/components/Capsule";
import { TogetherListItemProps } from "../types";
import tw from "@/shared/utils/tw";
import Link from "next/link";

function TogetherListItem({
  id,
  image,
  name,
  category,
  isOnline,
  onClick,
  widthClass,
  href,
}: TogetherListItemProps & { onClick?: () => void }) {
  const content = (
    <>
      {" "}
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
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={tw(
          "w-56 h-fit p-2 flex items-center gap-2 bg-white ring ring-pastelblue rounded-lg hover:bg-gray-100 hover:shadow transition-all",
          widthClass,
        )}
      >
        {content}
      </Link>
    );
  }
  return (
    <div
      onClick={onClick}
      className={tw(
        "w-56 h-fit p-2 flex items-center gap-2 bg-white ring ring-pastelblue rounded-lg",
        widthClass,
      )}
    >
      {content}
    </div>
  );
}

export default TogetherListItem;

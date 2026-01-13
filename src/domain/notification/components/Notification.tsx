"use client";
import Link from "next/link";
import { NotificationResponse, NotificationSummaryResponse } from "../types";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";

function Notification({
  summary = false,
  notification: {
    id,
    notificationType,
    isRead: read,
    targetType,
    targetId,
    message,
    senderProfileImage,
    senderNickname,
  },
  onClick,
}: {
  summary?: boolean;
  notification: NotificationResponse | NotificationSummaryResponse;
  onClick: () => void;
}) {
  const handleRead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <li
      className={`${
        read
          ? "bg-gray-100 hover:shadow-2xs text-gray-500"
          : "bg-pastelblue hover:shadow"
      } w-full ${
        summary ? "px-2 py-1" : "px-3 py-3"
      } rounded-lg flex gap-2 justify-between items-center`}
    >
      <div className="flex gap-3 ">
        {!summary && (
          <div className="relative w-12 h-12 rounded-full shrink-0">
            <Image
              src={
                senderProfileImage ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU"
              }
              alt={`${senderNickname} 프로필이미지`}
              fill
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        )}
        <Link href={`${targetType}/${targetId}`} onClick={onClick}>
          <span className="text-sm">{notificationType}</span>
          <p className={`${summary ? `w-45 truncate` : "w-full"}`}>{message}</p>
        </Link>
      </div>
      <div className="flex gap-3 shrink-0">
        {!read && !summary && (
          <button
            type="button"
            className="flex-center flex-col gap-1 shrink-0 cursor-pointer group"
            onClick={handleRead}
          >
            <AiOutlineCheckCircle
              size={20}
              className="w-full group-hover:text-mainblue"
            />
            <p className="text-xs group-hover:text-mainblue">읽음처리</p>
          </button>
        )}
        {!summary && (
          <button
            type="button"
            className="flex-center flex-col gap-1 shrink-0 cursor-pointer group"
            onClick={handleRead}
          >
            <AiOutlineDelete size={20} className="group-hover:text-mainred" />
            <p className="text-xs group-hover:text-mainred">삭제</p>
          </button>
        )}
      </div>
    </li>
  );
}

export default Notification;

"use client";
import Link from "next/link";
import { NotificationResponse, NotificationSummaryResponse } from "../types";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import { useReadNotification } from "../api/useReadNotification";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import { useEffect, useState } from "react";
import { useDeleteNotification } from "../api/useDeleteNotification";
import Swal from "sweetalert2";
import { notificationOptions, targetOptions } from "@/shared/constants/filter";
import Capsule from "@/shared/components/Capsule";

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
  type,
  onClick,
}: {
  summary?: boolean;
  notification: NotificationResponse | NotificationSummaryResponse;
  type?: string;
  onClick?: () => void;
}) {
  const qc = useQueryClient();
  const [isRead, setIsRead] = useState(read);

  useEffect(() => {
    setIsRead(read);
  }, [read]);

  const { mutate: readNotification } = useReadNotification({
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.read(),
      });
      if (type)
        qc.invalidateQueries({
          queryKey: queryKeys.notifications.list(type),
        });
      else
        qc.invalidateQueries({
          queryKey: queryKeys.notifications.list("ALL"),
        });
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.recent,
      });
    },
    onMutate: () => {
      setIsRead(true);
    },
    onError: () => {
      setIsRead(false);
    },
  });

  const { mutate: deleteNotification } = useDeleteNotification({
    onSuccess: () => {
      if (type)
        qc.invalidateQueries({
          queryKey: queryKeys.notifications.list(type),
        });
      else
        qc.invalidateQueries({
          queryKey: queryKeys.notifications.list("ALL"),
        });
      qc.invalidateQueries({
        queryKey: queryKeys.notifications.recent,
      });
    },
  });

  const handleRead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    readNotification(id!);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    Swal.fire({
      title: "알림",
      text: "알림을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNotification(id!);
      }
    });
  };

  const handleNotificationClick = () => {
    if (onClick) onClick();
    if (!isRead) readNotification(id!);
  };

  return (
    <li
      className={`${
        isRead
          ? "bg-gray-100 hover:shadow-2xs text-gray-500"
          : "bg-pastelblue hover:shadow"
      } w-full ${
        summary ? "px-2 py-1" : "px-3 py-3"
      } rounded-lg flex gap-2 justify-between items-center`}
    >
      <div className="flex gap-3 w-full">
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
        <Link
          href={
            targetType === "NONE" || !targetType
              ? "#"
              : targetType === "COMMENT"
                ? "/mypage/replies"
                : `${targetOptions[targetType]}${targetId}`
          }
          onClick={handleNotificationClick}
          className="w-full"
        >
          <span className="text-sm">
            {
              notificationOptions[
                notificationType as keyof typeof notificationOptions
              ]
            }
          </span>
          <p className={`${summary ? `w-45 truncate` : "w-full"}`}>
            {senderNickname && (
              <Capsule
                text={senderNickname}
                type="status"
                className="bg-gray-50 text-xs mr-1"
              ></Capsule>
            )}
            {message}
          </p>
        </Link>
      </div>
      <div className="flex gap-3 shrink-0">
        {!summary && (
          <button
            type="button"
            className={`flex-center flex-col gap-1 shrink-0 ${
              isRead ? "" : "cursor-pointer"
            } group`}
            onClick={isRead ? undefined : handleRead}
          >
            <AiOutlineCheckCircle
              size={20}
              className={`w-full ${isRead ? "" : "group-hover:text-mainblue"}`}
            />
            <p
              className={`text-xs ${isRead ? "" : "group-hover:text-mainblue"}`}
            >
              읽음처리
            </p>
          </button>
        )}
        {!summary && (
          <button
            type="button"
            className="flex-center flex-col gap-1 shrink-0 cursor-pointer group"
            onClick={handleDelete}
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

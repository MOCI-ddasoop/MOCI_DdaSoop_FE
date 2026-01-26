"use client";
import Notification from "@/domain/notification/components/Notification";
import Pagination from "@/shared/components/Pagination";
import { useGetNotification } from "../api/useGetNotification";
import { useSearchParams } from "next/navigation";

const notification = Array.from({ length: 3 }).map((_, i) => ({
  isRead: false,
  message:
    "바보님이 댓글을 달았습니다 바보님이 댓글을 달았습니다 바보님이 댓글을 달았습니다 바보님이 댓글을 달았습니다",
  // href: "/mypage",
  id: i,
  targetId: 1,
  senderNickname: "바보",
}));
function NotificationContainer({
  type = "ALL",
}: {
  type?: "ALL" | "LIKES" | "COMMENTS" | "TOGETHER" | "SYSTEM";
}) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  // 타입에 따라서 api 통신
  const {
    data: notification,
    isPending,
    isError,
  } = useGetNotification(type, page, 10);

  return isPending && !isError ? (
    <div className="h-28 flex-center">
      <div className="loader"></div>
    </div>
  ) : (
    <>
      <ul
        className={`w-full flex-center flex-col gap-2 pt-2 ${notification && notification.totalPages && notification.totalPages <= 1 ? "mb-5" : ""}`}
      >
        {notification &&
        notification.content &&
        notification.content.length === 0 ? (
          <p className="w-full flex-center py-5 text-gray-500">
            알림이 없습니다
          </p>
        ) : isError ? (
          <p className="w-full flex-center py-5 text-gray-500">
            알림 가져오기에 실패했습니다
          </p>
        ) : (
          notification.content &&
          notification.content.map((n, i) => (
            <Notification key={i} notification={n} type={type} />
          ))
        )}
      </ul>
      <Pagination totalPages={notification?.totalPages ?? 0} />
    </>
  );
}

export default NotificationContainer;

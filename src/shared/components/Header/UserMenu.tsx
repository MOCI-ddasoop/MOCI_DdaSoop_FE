"use client";
import Link from "next/link";
import {
  useClick,
  useFloating,
  useInteractions,
  arrow,
  FloatingArrow,
  offset,
  flip,
  autoUpdate,
  useDismiss,
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Notification from "@/domain/notification/components/Notification";
import { useGetRecentNotification } from "@/domain/notification/api/useGetRecentNotification";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

function UserMenu() {
  const queryClient = useQueryClient();

  const isLogin = useAuthStore((state) => state.me);

  const [isOpen, setIsOpen] = useState(false);
  // 로그인되었는지 여부 가져오는거 추가하기
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(20), flip(), arrow({ element: arrowElement })],
  });
  const { setReference, setFloating } = refs;
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ]);
  const pathname = usePathname();
  const {
    data: notifications = [],
    isPending,
    isError,
  } = useGetRecentNotification(!!isLogin);

  useEffect(() => {
    if (!isLogin) {
      queryClient.removeQueries({ queryKey: queryKeys.notifications.recent });
    }
  }, [isLogin, queryClient]);

  if (!isLogin)
    return (
      <Link
        href="/login"
        className="px-3 py-2 bg-skyBlue rounded-xl hover:ring-2 hover:ring-mainblue"
      >
        로그인
      </Link>
    );
  return (
    <ul
      className={`h-full flex items-center justify-center ${
        isOpen || pathname.startsWith("/notification")
          ? "gap-4 lg:gap-6"
          : "gap-6 lg:gap-8"
      }`}
    >
      <li
        ref={setReference}
        {...getReferenceProps()}
        className={
          isOpen || pathname.startsWith("/notification")
            ? "rounded-full bg-pastelblue p-2"
            : ""
        }
      >
        <button type="button" className="flex-center cursor-pointer">
          <IoNotificationsOutline size={28} />
        </button>
      </li>
      <li>
        <Link
          href="/mypage"
          className="h-hover:bg-gray-100 flex justify-center items-center"
        >
          <FaCircleUser size={28} />
        </Link>
      </li>
      {isOpen ? (
        <div
          className="w-fit h-fit flex-center flex-col bg-white rounded-lg p-2 border-2 border-skyBlue shadow"
          ref={setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div className="w-full flex justify-between items-center pb-2 px-1">
            <h1 className="font-medium">알림</h1>
            <Link
              href="/notification"
              className="hover:underline hover:underline-offset-2"
              onClick={() => setIsOpen(false)}
            >
              더보기
            </Link>
          </div>

          {isPending ? (
            <div className="h-28 flex-center">
              <div className="loader"></div>
            </div>
          ) : isError ? (
            <p>오류가 발생했습니다</p>
          ) : (
            <ul className="flex-center flex-col gap-2">
              {notifications.length === 0 ? (
                <p className="w-50 px-1 py-5 flex-center text-gray-500">
                  알림이 없습니다
                </p>
              ) : (
                notifications.map((notification, i) => (
                  <Notification
                    key={i}
                    notification={notification}
                    onClick={() => setIsOpen(false)}
                    summary
                  />
                ))
              )}
            </ul>
          )}
          <FloatingArrow
            ref={setArrowElement}
            context={context}
            width={10}
            fill="#FAFAFA"
            strokeWidth={2}
            stroke="#a1d4f1"
            style={{ transform: "translateY(-1px)" }}
          ></FloatingArrow>
        </div>
      ) : null}
    </ul>
  );
}

export default UserMenu;

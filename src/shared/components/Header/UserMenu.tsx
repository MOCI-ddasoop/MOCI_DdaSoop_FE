"use client";
import Image from "next/image";
import notification from "@/assets/icons/notification.svg";
import mypage from "@/assets/icons/mypage.svg";
import Link from "next/link";
import Notification from "./Notification";
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
import { useState } from "react";

export interface NotificationProps {
  read: boolean;
  type: string;
  comment: string;
  href: string;
}

function UserMenu() {
  const isLogin = true;
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
  const notifications: NotificationProps[] = Array.from({ length: 3 }).map(
    () => ({
      read: false,
      type: "댓글",
      comment: "바보님이 댓글을 달았습니다",
      href: "/mypage",
    })
  );

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
    <ul className="h-full flex items-center justify-center gap-6 lg:gap-8">
      <li ref={setReference} {...getReferenceProps()}>
        <Image
          src={notification}
          width={0}
          height={0}
          alt="알림 아이콘"
          style={{ width: "auto", height: "24px" }}
          loading="eager" // LCP요소까지는 아니기 때문에 eager로 설정
          className="cursor-pointer"
        ></Image>
      </li>
      <li>
        <Link
          href="/mypage"
          className="h-hover:bg-gray-100 flex justify-center items-center"
        >
          <Image
            src={mypage}
            width={28}
            height={28}
            alt="마이페이지 아이콘"
            loading="eager" // LCP요소까지는 아니기 때문에 eager로 설정
          ></Image>
        </Link>
      </li>
      {isOpen && (
        <div
          className="w-fit h-fit flex-center flex-col bg-white rounded-lg p-2 border-2 border-skyBlue shadow"
          ref={setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div className="w-full flex justify-between items-center pb-2 px-1">
            <h1 className="font-medium">알림</h1>
            <Link
              href="/mypage"
              className="hover:underline hover:underline-offset-2"
              onClick={() => setIsOpen(false)}
            >
              더보기
            </Link>
          </div>
          <ul className="flex-center flex-col gap-2">
            {notifications.map((notification, i) => (
              <Notification
                key={i}
                notification={notification}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </ul>
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
      )}
    </ul>
  );
}

export default UserMenu;

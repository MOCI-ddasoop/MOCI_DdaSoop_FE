"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import tw from "@/shared/utils/tw";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/members", label: "회원 관리" },
  { href: "/admin/reports", label: "신고 관리" },
  { href: "/admin/feeds", label: "피드 관리" },
  { href: "/admin/comments", label: "댓글 관리" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-pastelblue-border pb-4 mb-6">
      <h2 className="sr-only">관리자 메뉴</h2>
      <ul className="flex flex-wrap gap-2">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={tw(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-mainblue text-white"
                    : "bg-pastelblue text-black hover:bg-pastelblue-selected"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

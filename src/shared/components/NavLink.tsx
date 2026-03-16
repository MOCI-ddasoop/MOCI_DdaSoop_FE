"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavLink({
  href,
  name,
  tabBar = false,
  children,
  type,
  tabCount,
}: {
  href: string;
  name: string;
  tabBar?: boolean;
  children?: React.ReactNode;
  type?: "donate" | "together" | "mypage" | "notification";
  tabCount?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const tabWidth: { [key: number]: string } = {
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
    6: "w-1/6",
  };
  return (
    <li
      className={`${
        tabBar
          ? `${tabWidth[tabCount ?? 1]} ${
              type === "mypage" && isActive && children ? "h-30" : "h-15"
            }`
          : ""
      }
      flex flex-col items-center relative`}
    >
      <Link
        href={href}
        className={`h-15 hover:bg-gray-100 flex justify-center items-center text-xl whitespace-nowrap border-b-2 ${
          tabBar
            ? `w-full ${
                type === "donate"
                  ? isActive
                    ? "border-mainred"
                    : "border-pastelred"
                  : isActive
                  ? "border-mainblue"
                  : "border-pastelblue"
              }`
            : `${
                isActive ? "border-black" : "border-transparent"
              } w-20 sm:w-25 md:w-30 lg:w-40 xl:w-45`
        } ${isActive ? "font-semibold" : ""}`}
      >
        {name}
      </Link>
      {isActive && children}
    </li>
  );
}

export default NavLink;

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
}: {
  href: string;
  name: string;
  tabBar?: boolean;
  children?: React.ReactNode;
  type?: "donate" | "together" | "mypage";
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li
      className={`${
        tabBar
          ? type === "mypage" && isActive
            ? "w-1/5 h-30"
            : "w-1/5 h-15"
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

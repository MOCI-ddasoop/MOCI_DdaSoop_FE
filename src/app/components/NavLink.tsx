"use client";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  name,
  tabBar = false,
}: {
  href: string;
  name: string;
  tabBar?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`h-full hover:bg-gray-100 flex justify-center items-center text-xl ${
        tabBar
          ? "w-20 sm:w-25 md:w-30 lg:w-40 xl:w-50 border-mainblue"
          : "w-20 sm:w-25 md:w-30 lg:w-40 xl:w-45 border-black"
      } ${isActive ? "font-semibold border-b-2" : ""}`}
    >
      {name}
    </a>
  );
}

export default NavLink;

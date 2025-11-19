"use client";
import { usePathname } from "next/navigation";

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
  children?: { href: string; name: string }[];
  type?: "donate" | "together" | "mypage";
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div
      className={`${
        tabBar ? (type === "mypage" ? "w-1/5 h-30" : "w-1/5 h-15") : ""
      }
      flex flex-col items-center relative`}
    >
      <a
        href={href}
        className={`h-15 hover:bg-gray-100 flex justify-center items-center text-xl whitespace-nowrap ${
          tabBar
            ? type === "donate"
              ? "w-full border-mainred"
              : "w-full border-mainblue"
            : "w-20 sm:w-25 md:w-30 lg:w-40 xl:w-45 border-black"
        } ${isActive ? "font-semibold border-b-2" : ""}`}
      >
        {name}
      </a>
      <ul
        className={`${isActive ? "visible" : "invisible"} flex top-15 absolute`}
      >
        {children &&
          children.map(({ href, name }) => (
            <a
              key={href}
              href={href}
              className={`h-15 hover:bg-gray-100 flex justify-center items-center text-xl w-fit whitespace-nowrap px-3 lg:px-7 xl:px-10 ${
                pathname === href ? "font-semibold text-mainblue" : ""
              }`}
            >
              {name}
            </a>
          ))}
      </ul>
    </div>
  );
}

export default NavLink;

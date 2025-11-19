"use client";
import Link from "next/link";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

interface TabContentsType {
  href: string;
  name: string;
  children?: { href: string; name: string }[];
}

function TabBar({
  tabContents,
  type,
}: {
  tabContents: TabContentsType[];
  type?: "donate" | "mypage" | "together";
}) {
  const pathname = usePathname();
  return (
    <ul className="w-full h-fit flex justify-start items-baseline">
      {tabContents.map(({ href, name, children }) => (
        <NavLink key={href} href={href} name={name} tabBar type={type}>
          <ul className="flex top-15 left-1/2 -translate-x-1/2 absolute">
            {children &&
              children.map(({ href, name }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`h-15 hover:bg-gray-100 flex justify-center items-center text-xl w-fit whitespace-nowrap px-3 lg:px-7 xl:px-10 ${
                      pathname === href ? "font-semibold text-mainblue" : ""
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              ))}
          </ul>
        </NavLink>
      ))}
    </ul>
  );
}

export default TabBar;

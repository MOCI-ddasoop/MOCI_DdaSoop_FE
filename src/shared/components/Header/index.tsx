import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/shared/utils/navigation";

import NavLink from "../NavLink";
import UserMenu from "./UserMenu";

function Header() {
  return (
    <>
      <header className="bg-white fixed top-0 left-0 w-full h-[60px] flex-center px-15 md:px-25 lg:px-30 xl:px-35 shadow-md z-50">
        <div className="w-[1000px] flex items-center">
          <Link href="/" className="mr-5 lg:mr-10 xl:mr-15">
            <Image
              src="/logo.svg"
              width={0}
              height={0}
              alt="따숲로고"
              style={{ width: "auto", height: "40px" }}
              loading="eager" // LCP요소까지는 아니기 때문에 eager로 설정
            ></Image>
          </Link>
          <nav className="h-full flex items-center justify-between flex-1">
            <h2 className="sr-only">메인메뉴</h2>
            <ul className="invisible w-10 h-full sm:visible sm:w-fit flex items-center justify-center">
              {navItems.map(({ path, name }) => (
                <NavLink href={path} name={name} key={name} />
              ))}
            </ul>
            <UserMenu />
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;

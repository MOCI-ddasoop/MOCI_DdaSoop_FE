import { navItems } from "@/src/utils/navigation";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";

function Header() {
  return (
    <>
      <header className="w-full h-[60px] flex items-center px-15 md:px-25 lg:px-30 xl:px-35 shadow-md">
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
          <ul className="h-full flex items-center justify-center gap-6 lg:gap-8">
            <Image
              src="/icons/notification.svg"
              width={0}
              height={0}
              alt="알림 아이콘"
              style={{ width: "auto", height: "24px" }}
              loading="eager" // LCP요소까지는 아니기 때문에 eager로 설정
            ></Image>
            <a
              href="/mypage"
              className="h-hover:bg-gray-100 flex justify-center items-center"
            >
              <Image
                src="/icons/mypage.svg"
                width={28}
                height={28}
                alt="마이페이지 아이콘"
                loading="eager" // LCP요소까지는 아니기 때문에 eager로 설정
              ></Image>
            </a>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;

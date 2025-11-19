import NavLink from "./NavLink";

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
  return (
    <div className="w-full h-fit flex justify-start items-baseline">
      {tabContents.map(({ href, name, children }) => (
        <NavLink key={href} href={href} name={name} tabBar type={type}>
          {children}
        </NavLink>
      ))}
    </div>
  );
}

export default TabBar;

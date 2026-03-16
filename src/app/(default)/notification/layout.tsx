import TabBar from "@/shared/components/TabBar";
import { notificationTabContents } from "@/shared/utils/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold pt-7 pb-2 self-start">알림</h1>
      <TabBar tabContents={notificationTabContents} type="notification" />
      {children}
    </div>
  );
}
export default Layout;

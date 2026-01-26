import ReadAllButton from "@/domain/notification/components/ReadAllButton";
import TabBar from "@/shared/components/TabBar";
import { notificationTabContents } from "@/shared/utils/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between gap-2 py-4">
        <h1 className="text-xl font-semibold">알림</h1>
        <ReadAllButton />
      </div>
      <TabBar tabContents={notificationTabContents} type="notification" />
      {children}
    </div>
  );
}
export default Layout;

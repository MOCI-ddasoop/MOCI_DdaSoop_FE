import UserInfo from "@/domain/user/components/UserInfo";
import TabBar from "@/shared/components/TabBar";
import { mypageTabContents } from "@/shared/utils/navigation";

function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-250 py-10 gap-6">
        <UserInfo />
        <TabBar tabContents={mypageTabContents} type="mypage" />
        {children}
      </div>
    </div>
  );
}
export default MyPageLayout;

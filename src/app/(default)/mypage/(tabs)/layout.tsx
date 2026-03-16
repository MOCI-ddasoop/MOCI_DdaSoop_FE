import UserInfo from "@/domain/user/components/UserInfo"
import TabBar from "@/shared/components/TabBar"
import { mypageTabContents } from "@/shared/utils/navigation"

function MyPageTabsLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <UserInfo />
      <TabBar tabContents={mypageTabContents} type="mypage" />
      {children}
    </>
  )
}
export default MyPageTabsLayout
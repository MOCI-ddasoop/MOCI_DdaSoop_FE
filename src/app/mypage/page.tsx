import CardContainer from "@/domain/mypage/components/CardContainer";
import TabBar from "../components/TabBar";
import { mypageTabContents } from "@/utils/navigation";
import UserInfo from "@/domain/mypage/components/UserInfo";

function TestPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-250 py-10 gap-10">
        <UserInfo />
        <TabBar tabContents={mypageTabContents} type="mypage" />
        <CardContainer className="px-4" />
      </div>
    </div>
  );
}

export default TestPage;

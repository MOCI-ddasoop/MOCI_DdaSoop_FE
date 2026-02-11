import Link from "next/link";
import { HiPlusCircle } from "react-icons/hi";

function AddParticipationCard({
  type,
  fullWidth = false,
  isLogin,
}: {
  type: "together" | "donate";
  fullWidth?: boolean;
  isLogin: boolean;
}) {
  const handleAlert = () => {
    if (!isLogin) alert("로그인이 필요합니다");
  };
  return (
    <Link
      href={
        !isLogin
          ? "#"
          : type === "donate"
            ? "/donate/create"
            : "together/create"
      } // TODO : 경로 바꾸기
      className={`relative flex-center flex-col gap-2 min-w-[230px] w-full ${
        fullWidth ? "" : "xl:max-w-[230px]"
      } h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg hover:bg-gray-100`}
      onClick={handleAlert}
    >
      <HiPlusCircle
        color={type === "donate" ? "#EB5353" : "#237db1"}
        size={60}
      />
      <h1 className="text-lg font-semibold">
        새로운 {type === "donate" ? "후원하기" : "함께하기"} 추가
      </h1>
    </Link>
  );
}

export default AddParticipationCard;

import Link from "next/link";
import { HiPlusCircle } from "react-icons/hi";

function AddParticipationCard({
  type,
  fullWidth = false,
}: {
  type: "together" | "donate";
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={type === "donate" ? "/donate/create" : "together/create"} // TODO : 경로 바꾸기
      className={`relative flex-center flex-col gap-2 min-w-[230px] w-full ${
        fullWidth ? "" : "xl:max-w-[230px]"
      } h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg hover:bg-gray-100`}
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

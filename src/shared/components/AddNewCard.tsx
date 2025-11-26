import Link from "next/link";
import { HiPlusCircle } from "react-icons/hi";

function AddNewCard({ type }: { type: "togethger" | "donate" }) {
  return (
    <Link
      href={type === "donate" ? "/donate/new" : "together/new"} // TODO : 경로 바꾸기
      className="relative flex-center flex-col gap-2 w-[230px] h-75 rounded-lg bg-white ring ring-gray-300 hover:shadow-lg hover:bg-gray-100"
    >
      <HiPlusCircle color="#237db1" size={60} />
      <h1 className="text-lg font-semibold">
        새로운 {type === "donate" ? "후원하기" : "함께하기"} 추가
      </h1>
    </Link>
  );
}

export default AddNewCard;

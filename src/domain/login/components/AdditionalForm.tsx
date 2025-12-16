"use client"
import Button from "@/shared/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
//TODO : 첫 로그인 시에만 리다이렉트 하도록 설정
function AdditionalForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const isFormFilled = nickname.trim() !== "" && email.trim() !== "";

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO: 추가 정보 제출 로직 
    console.log("추가 정보 제출 완료", { nickname, email });
    
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4">
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <label htmlFor="nickname" className="text-xl font-bold">닉네임</label>
          <span className="text-mainred text-sm ml-3">*필수 입력 항목입니다</span>
        </div>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-1">
          <label htmlFor="email" className="text-xl font-bold">이메일</label>
          <span className="text-mainred text-sm ml-3">*필수 입력 항목입니다</span>
        </div>
        <input
          type="email"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Button 
          type="submit"
          fullWidth 
          className="font-medium"
          disabled={!isFormFilled}  
        >
          작성완료
        </Button>
      </div>
    </form>
  )
}
export default AdditionalForm
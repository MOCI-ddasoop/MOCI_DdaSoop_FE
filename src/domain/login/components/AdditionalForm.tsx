"use client"
import Button from "@/shared/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { completeRegistration } from "../api/completeRegistration";
import { checkNickname } from "../api/checkNickname";
import { checkEmail } from "../api/checkEmail";

export default function AdditionalForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const searchParams = useSearchParams();
  const temporaryToken = searchParams.get("token") || "";

  useEffect(()=>{setIsNicknameChecked(false);},[nickname]);
  useEffect(()=>{setIsEmailChecked(false);},[email]);

  const handleNicknameCheck = async () => {
    if(!nickname.trim()) return alert("닉네임을 입력해주세요.");
    try{
      const isAvailable = await checkNickname(nickname);
      if(isAvailable){
        setIsNicknameChecked(true);
        alert("사용 가능한 닉네임입니다.");
      }
      else{
        alert("이미 사용 중인 닉네임입니다.");
      }
    }catch(error){
      alert("닉네임 중복 체크 중 오류가 발생했습니다.");
    }
  }
  const handleEmailCheck = async () => {
    if(!email.trim()) return alert("이메일을 입력해주세요.");
    try{
      const isAvailable = await checkEmail(email);
      if(isAvailable){
        setIsEmailChecked(true);
        alert("사용 가능한 이메일입니다.");
      }
      else{
        alert("이미 사용 중인 이메일입니다.");
      }
    }catch(error){
      alert("이메일 중복 체크 중 오류가 발생했습니다.");
    } 
  }
  const isFormFilled = nickname.trim() !== "" && email.trim() !== "" && isNicknameChecked && isEmailChecked;

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormFilled || isLoading) return;

    setIsLoading(true);
    try{
      await completeRegistration({temporaryToken, nickname, email});
          router.replace("/");
    } catch (error) {
      console.error("추가 정보 제출 중 오류:", error);
    } finally {
      setIsLoading(false);
    }    
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
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue mr-4"
          placeholder="닉네임을 입력해주세요 (2~12자)"
          maxLength={12}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        {!isNicknameChecked ? (
          <Button
            type="button"
            size="sm"
            onClick={handleNicknameCheck}
          >
            중복 확인
          </Button>
        ) : (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        )}
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-1">
          <label htmlFor="email" className="text-xl font-bold">이메일</label>
          <span className="text-mainred text-sm ml-3">*필수 입력 항목입니다</span>
        </div>
        <input
          type="email"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue mr-4"
          placeholder="이메일을 입력해주세요"
          maxLength={100}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isEmailChecked ? (
          <Button
            type="button"
            size="sm"
            onClick={handleEmailCheck}
          >
            중복 확인
          </Button>
        ) : (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        )}
      </div>

      <div>
        <Button 
          type="submit"
          fullWidth 
          className="font-medium"
          disabled={!isFormFilled || isLoading}  
        >
          작성완료
        </Button>
      </div>
    </form>
  )

  }

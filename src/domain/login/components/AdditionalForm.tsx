"use client";
import Button from "@/shared/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { completeRegistration } from "../api/completeRegistration";
import { checkNickname } from "../api/checkNickname";
import { checkEmail } from "../api/checkEmail";
import { Alert } from "@/shared/utils/alert";

export default function AdditionalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const temporaryToken = searchParams.get("token") || "";
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null,
  );
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setNicknameAvailable(null);
  }, [nickname]);
  useEffect(() => {
    setEmailAvailable(null);
  }, [email]);

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) return Alert({ text: "닉네임을 입력해주세요." });
    try {
      const { available, message } = await checkNickname(nickname.trim());
      setNicknameAvailable(available ?? false);
      Alert({ text: message });
    } catch (e) {
      Alert({
        text: "닉네임 중복 체크 중 오류가 발생했습니다.",
        timer: 1500,
      });
    }
  };
  const handleEmailCheck = async () => {
    if (!email.trim()) return Alert({ text: "이메일을 입력해주세요." });
    try {
      const { available, message } = await checkEmail(email.trim());
      setEmailAvailable(available ?? false);
      Alert({ text: message });
    } catch (e) {
      Alert({
        text: "이메일 중복 체크 중 오류가 발생했습니다.",
        timer: 1500,
      });
    }
  };
  const isFormFilled =
    nickname.trim() !== "" &&
    email.trim() !== "" &&
    nicknameAvailable === true &&
    emailAvailable === true;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormFilled || isLoading) return;

    setIsLoading(true);
    try {
      await completeRegistration({ temporaryToken, nickname, email });
      router.replace("/");
    } catch (error) {
      console.error("추가 정보 제출 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4">
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <label htmlFor="nickname" className="text-xl font-bold">
            닉네임
          </label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue mr-4"
          placeholder="닉네임을 입력해주세요 (2~12자)"
          maxLength={12}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        {nicknameAvailable === true ? (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        ) : (
          <Button type="button" size="sm" onClick={handleNicknameCheck}>
            중복 확인
          </Button>
        )}
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-1">
          <label htmlFor="email" className="text-xl font-bold">
            이메일
          </label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>
        <input
          type="email"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue mr-4"
          placeholder="이메일을 입력해주세요"
          maxLength={100}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailAvailable === true ? (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        ) : (
          <Button type="button" size="sm" onClick={handleEmailCheck}>
            중복 확인
          </Button>
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
  );
}

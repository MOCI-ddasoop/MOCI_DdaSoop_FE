import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import KakaoLogin from "@/assets/socialLogin/kakao_Login.svg";
import NaverLogin from "@/assets/socialLogin/naver_Login.svg";
import GoogleLogin from "@/assets/socialLogin/google_Login.svg";
import { getLastLoginProvider } from "@/domain/login/api/getLastLogin";

export const metadata: Metadata = {
  title: "로그인",
  description: "로그인 페이지",
};

async function page() {
const lastLoginProvider = await getLastLoginProvider();

const providerMap: Record<string, string> = {
  KAKAO: "카카오",
  NAVER: "네이버",
  GOOGLE: "구글",
};

  return (
    <div className="w-[400px] h-[480px] rounded-xl shadow-lg bg-white flex flex-col px-10 py-10">
      <div className="mb-6">
        <Image src="/logo.svg" width={63} height={41} alt="따숲로고" />
      </div>

      <h3 className="text-2xl font-semibold text-center mb-8">로그인</h3>

      <div className="flex flex-col gap-5">
        <Link
          href={'https://api.ddasoop.xyz/oauth2/authorization/kakao'}
          className="w-full h-12 rounded-lg bg-[#FEE500] flex items-center justify-center gap-3 px-4 hover:bg-[#FEE500]/70"
          aria-label="카카오 소셜 로그인"
        >
          <KakaoLogin className="w-5 h-5"/>
          <span className="font-medium">카카오로 로그인하기</span>
        </Link>
        <Link
          href={'https://api.ddasoop.xyz/oauth2/authorization/naver'}
          className="w-full h-12 rounded-lg bg-[#03C75A] flex items-center justify-center gap-3 px-4 text-white hover:bg-[#03C75A]/80"
          aria-label="네이버 소셜 로그인"
        >
          <NaverLogin className="w-5 h-5"/>
          <span className="font-medium">네이버로 로그인하기</span>
        </Link>
        <Link
          href={'https://api.ddasoop.xyz/oauth2/authorization/google'}
          className="w-full h-12 rounded-lg bg-white border border-[#DADCE0] flex items-center justify-center gap-3 px-4 hover:bg-[#F7F7F7]"
          aria-label="구글 소셜 로그인"
        >
          <GoogleLogin className="w-5 h-5"/>
          <span className="font-medium">구글로 로그인하기</span>
        </Link>

        <p className="text-center text-sm text-gray-500 mt-2">
          소셜 로그인을 통해 더 많은 따숲 서비스를 이용해보세요!
        </p>

      </div>
      
      {lastLoginProvider && (
        <div className="bg-pastelblue rounded-lg w-full mt-5 p-2 ">
        <span className="text-sm text-mainblue font-semibold">
          최근 <strong>{providerMap[lastLoginProvider] || lastLoginProvider}</strong> 계정으로 로그인하였습니다.
        </span>
      </div>
      )}
    </div>
    
  );
}

export default page;

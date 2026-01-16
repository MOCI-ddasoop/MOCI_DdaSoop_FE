import { cookies } from "next/headers";
import { BASE_URL } from "@/shared/constants/api";

export async function getLastLoginProvider() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  if (!cookieString) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/last-login-provider`, {
      method: "GET",
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store", 
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.provider; 
  } catch (error) {
    console.error("최근 로그인 정보 호출 중 에러 발생:", error);
    return null;
  }
}
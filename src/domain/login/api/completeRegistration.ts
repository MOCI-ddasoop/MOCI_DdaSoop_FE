import { BASE_URL } from "@/shared/constants/api"

export const completeRegistration = async (data:{nickname: string, email: string}) => {
  const res = await fetch(`${BASE_URL}/api/auth/complete-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "회원가입 중 오류가 발생했습니다.");
  }

  return res.json();
}
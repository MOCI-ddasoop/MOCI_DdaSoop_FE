import AdditionalForm from "@/domain/login/components/AdditionalForm"
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "로그인-추가정보입력",
  description: "로그인 추가정보입력 페이지",
};

function page() {
  return (
    <div className="max-w-[1000px] mx-auto pt-8">
      <Suspense fallback={null}>
        <AdditionalForm />
      </Suspense>
    </div>
  )
}
export default page
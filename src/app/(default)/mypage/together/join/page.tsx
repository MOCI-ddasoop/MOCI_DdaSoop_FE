import TogetherSection from "@/domain/together/components/TogetherSection";
import { Suspense } from "react";

async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TogetherSection initialData={undefined} mypage />
    </Suspense>
  );
}

export default page;

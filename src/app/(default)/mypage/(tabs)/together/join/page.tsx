import MyTogetherSection from "@/domain/together/components/MyTogetherSection";
import { Suspense } from "react";

async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyTogetherSection />
    </Suspense>
  );
}

export default page;

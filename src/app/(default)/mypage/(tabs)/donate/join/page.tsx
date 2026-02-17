import MyDonateSection from "@/domain/donate/components/MyDonateSection";
import { Suspense } from "react";

async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyDonateSection type="join" />
    </Suspense>
  );
}

export default page;

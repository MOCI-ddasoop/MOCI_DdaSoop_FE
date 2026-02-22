import MyDonateHistory from "@/domain/donate/components/MyDonateHistory";
import { Suspense } from "react";

async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyDonateHistory />
    </Suspense>
  );
}

export default page;

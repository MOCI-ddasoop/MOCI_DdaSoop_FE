import FeedCardContainer from "@/domain/feed/components/FeedCardContainer";
import { Suspense } from "react";

function page() {
  return (
    <main className="w-full">
      <Suspense fallback={<div>Loading feeds...</div>}>
        <FeedCardContainer className="px-4" pageName="member" queryParams="1" />
      </Suspense>
    </main>
  );
}

export default page;

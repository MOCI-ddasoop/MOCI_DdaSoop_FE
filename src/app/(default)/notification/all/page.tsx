import NotificationContainer from "@/domain/notification/components/NotificationContainer";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationContainer type="ALL" />
    </Suspense>
  );
}

export default page;

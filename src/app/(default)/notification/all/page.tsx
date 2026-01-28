import DeleteReadButton from "@/domain/notification/components/DeleteReadButton";
import NotificationContainer from "@/domain/notification/components/NotificationContainer";
import ReadAllButton from "@/domain/notification/components/ReadAllButton";
import { Suspense } from "react";

function page() {
  return (
    <>
      <div className="flex-center self-end gap-2 pt-1">
        <ReadAllButton />
        <DeleteReadButton />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationContainer type="ALL" />
      </Suspense>
    </>
  );
}

export default page;

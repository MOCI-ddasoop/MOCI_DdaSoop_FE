import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { Suspense } from "react";

async function Together() {
  const initialData = await getInitTogetherList();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TogetherSection initialData={initialData} />
    </Suspense>
  );
}

export default Together;

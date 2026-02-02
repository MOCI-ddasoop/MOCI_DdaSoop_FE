import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";

async function Together() {
  const initialData = await getInitTogetherList();

  return (
    <>
      <TogetherSection initialData={initialData} />
    </>
  );
}

export default Together;

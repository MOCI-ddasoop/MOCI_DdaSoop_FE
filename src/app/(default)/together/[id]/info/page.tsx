import { getTogetherDescription } from "@/domain/together/api/getTogetherDescription";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: info } = await getTogetherDescription(id);
  return <p>{info}</p>;
}

export default page;

import { redirect } from "next/navigation";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/donate/${id}/info`);
}

export default page;

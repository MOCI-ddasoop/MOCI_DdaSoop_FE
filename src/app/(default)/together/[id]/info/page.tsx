import ClientInfo from "@/domain/participation/components/ClientInfo";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientInfo type="together" id={id} />;
}

export default page;

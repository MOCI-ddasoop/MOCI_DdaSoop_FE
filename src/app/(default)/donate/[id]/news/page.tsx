import DonateNews from "@/domain/donate/components/DonateNews";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DonateNews id={id} />;
}

export default page;

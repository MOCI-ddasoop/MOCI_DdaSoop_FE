import DonationHistoryContainer from "@/domain/donate/components/DonationHistoryContainer";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DonationHistoryContainer id={id} />;
}

export default page;

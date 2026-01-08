import FeedCardContainer from "@/domain/feed/components/FeedCardContainer";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FeedCardContainer pageName="together" queryParams={id} />;
}

export default page;

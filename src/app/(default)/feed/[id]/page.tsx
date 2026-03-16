import { getFeedById } from "@/domain/feed/api/getFeedById";
import FeedModal from "@/domain/feed/components/FeedModal";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const feed = await getFeedById(id);
	const title = feed.content?.slice(0, 30) + "...";
	return {
		title,
		description: feed?.content?.slice(0, 160),	
		openGraph: {
			images: feed?.images?.[0]?.imageUrl,
		type:"website"
		},
	};
}
export default async function FeedPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const feed= await getFeedById(id);
	return (
		<main>
			<FeedModal feedId={id} initialData={feed} />;
		</main>
	);
}

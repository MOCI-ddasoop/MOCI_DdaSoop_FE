import FeedModal from "@/domain/feed/components/FeedModal";

export default async function FeedPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<main>
			<FeedModal feedId={id} />;
		</main>
	);
}

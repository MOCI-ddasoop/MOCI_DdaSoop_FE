export const decodedCatch = new Set<string>();

export async function preloadAndDecode(url: string) {
	if (decodedCatch.has(url)) return;

	const img = new Image();
	img.src = url;
	try {
		await img.decode();
		decodedCatch.add(url);
	} catch (e) {
		console.log("decode error", url, e);
	}
}

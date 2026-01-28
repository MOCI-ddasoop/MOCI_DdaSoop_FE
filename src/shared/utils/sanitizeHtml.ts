import DOMPurify from "dompurify";

export function sanitizeHtml(rawHtml: string) {
	const ALLOWED_URL_REGEXP = /^(https?|mailto):/i;

	DOMPurify.addHook("afterSanitizeAttributes", (node) => {
		if (node.tagName === "A") {
			node.setAttribute("target", "_blank");
			node.setAttribute("rel", "noopener noreferrer");
		}
	});

	const sanitized = DOMPurify.sanitize(rawHtml, {
		ALLOWED_TAGS: ["span", "a", "br"],
		ALLOWED_ATTR: ["href", "class"],
		ALLOWED_URI_REGEXP: ALLOWED_URL_REGEXP,

		FORBID_ATTR: ["onerror", "onclick", "onmouseover"],
		FORBID_TAGS: ["style", "script", "iframe"],

		ADD_ATTR: ["target", "rel"],

		SANITIZE_DOM: true,
	});

	DOMPurify.removeAllHooks();

	return sanitized;
}

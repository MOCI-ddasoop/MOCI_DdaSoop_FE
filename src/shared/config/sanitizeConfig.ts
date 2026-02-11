import type { DOMPurify } from "dompurify";
export const ALLOWED_URL_REGEXP = /^(https?|mailto):/i;

export const sanitizeOptions = {
  ALLOWED_TAGS: ["span", "a", "br"],
  ALLOWED_ATTR: ["href", "class"],
  ALLOWED_URI_REGEXP: ALLOWED_URL_REGEXP,

  FORBID_ATTR: ["onerror", "onclick", "onmouseover"],
  FORBID_TAGS: ["style", "script", "iframe"],

  ADD_ATTR: ["target", "rel"],

  SANITIZE_DOM: true,
};

export function applyAnchorHook(DOMPurify: DOMPurify) {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

import {
  applyAnchorHook,
  sanitizeOptions,
} from "@/shared/config/sanitizeConfig";
import DOMPurify from "dompurify";

export function sanitizeHtml(rawHtml: string) {
  applyAnchorHook(DOMPurify);

  const sanitized = DOMPurify.sanitize(rawHtml, sanitizeOptions);

  DOMPurify.removeAllHooks();

  return sanitized;
}

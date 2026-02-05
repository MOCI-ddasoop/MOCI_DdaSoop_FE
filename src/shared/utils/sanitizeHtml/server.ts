import {
  applyAnchorHook,
  sanitizeOptions,
} from "@/shared/config/sanitizeConfig";
import createDOMPurify, { WindowLike } from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window as unknown as WindowLike;
const DOMPurify = createDOMPurify(window);

export function sanitizeHtml(rawHtml: string) {
  applyAnchorHook(DOMPurify);

  const sanitized = DOMPurify.sanitize(rawHtml, sanitizeOptions);

  DOMPurify.removeAllHooks();
  return sanitized;
}

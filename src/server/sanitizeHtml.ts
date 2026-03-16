import { JSDOM } from "jsdom";
import createDOMPurify, { WindowLike } from "dompurify";
import {
  applyAnchorHook,
  sanitizeOptions,
} from "@/shared/config/sanitizeConfig";

const window = new JSDOM("").window as unknown as WindowLike;
const DOMPurify = createDOMPurify(window);

applyAnchorHook(DOMPurify);

export function sanitizeHtml(rawHtml: string) {
  applyAnchorHook(DOMPurify);
  const sanitized = DOMPurify.sanitize(rawHtml, sanitizeOptions);
  DOMPurify.removeAllHooks();

  return sanitized;
}

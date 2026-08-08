import Image from "next/image";
import parse, { type DOMNode, Element } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { getDirectusUrl } from "@/lib/directus/client";

function normalizeAssetUrl(value: string): string | null {
  try {
    const directusUrl = getDirectusUrl();
    const url = new URL(value, directusUrl);
    return url.origin === directusUrl.origin && url.pathname.startsWith("/assets/") ? url.toString() : null;
  } catch {
    return null;
  }
}

function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "a", "img", "blockquote", "br", "figure", "figcaption"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (_tagName, attributes) => ({ tagName: "a", attribs: { ...attributes, target: attributes.target === "_blank" ? "_blank" : "_self", rel: attributes.target === "_blank" ? "noopener noreferrer" : "" } }),
      img: (_tagName, attributes) => ({ tagName: "img", attribs: { ...attributes, src: normalizeAssetUrl(attributes.src || "") || "" } }),
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });
}

function replaceImage(domNode: DOMNode) {
  if (!(domNode instanceof Element) || domNode.name !== "img") return;
  const src = normalizeAssetUrl(domNode.attribs.src || "");
  if (!src) return <></>;
  const width = Number.parseInt(domNode.attribs.width || "1200", 10) || 1200;
  const height = Number.parseInt(domNode.attribs.height || "800", 10) || 800;
  return <Image src={src} alt={domNode.attribs.alt || "Иллюстрация к статье"} width={width} height={height} sizes="(min-width: 1024px) 896px, 100vw" className="h-auto w-full rounded-2xl" />;
}

export function ArticleContent({ html }: { html: string }) {
  return <div className="article-body mt-14">{parse(sanitizeContent(html), { replace: replaceImage })}</div>;
}

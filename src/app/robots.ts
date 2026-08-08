import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/preview/"],
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}

import type { MetadataRoute } from "next";
import { getPublishedArticleSitemapEntries } from "@/lib/directus/articles";
import { getCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: getCanonicalUrl(), changeFrequency: "monthly", priority: 1 },
    { url: getCanonicalUrl("/blog/"), changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const articles = await getPublishedArticleSitemapEntries();
    return [
      ...staticPages,
      ...articles.map((article) => ({
        url: getCanonicalUrl(`/blog/${encodeURIComponent(article.slug)}/`),
        lastModified: article.updatedAt || article.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error("Unable to add Directus articles to sitemap.", error);
    return staticPages;
  }
}

import type { Article, ArticleImage } from "@/types/content";
import { directusFetch, getDirectusUrl } from "@/lib/directus/client";

type DirectusArticle = {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  updated_at: string | null;
  cover: ArticleImage | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: ArticleImage | null;
};

const articleFields = ["id", "title", "slug", "excerpt", "content", "published_at", "updated_at", "cover.id", "cover.width", "cover.height", "cover.title", "cover.description", "seo_title", "seo_description", "og_image.id", "og_image.width", "og_image.height", "og_image.title", "og_image.description"].join(",");

function mapArticle(article: DirectusArticle): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    cover: article.cover,
    seoTitle: article.seo_title,
    seoDescription: article.seo_description,
    ogImage: article.og_image,
  };
}

function publishedParams(): URLSearchParams {
  return new URLSearchParams({
    fields: articleFields,
    "filter[status][_eq]": "published",
  });
}

export async function getPublishedArticles(): Promise<Article[]> {
  const params = publishedParams();
  params.set("sort", "-published_at");
  return (await directusFetch<DirectusArticle[]>("items/articles", params)).map(mapArticle);
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  const params = publishedParams();
  params.set("filter[slug][_eq]", slug);
  params.set("limit", "1");
  const [article] = await directusFetch<DirectusArticle[]>("items/articles", params);
  return article ? mapArticle(article) : null;
}

export async function getPublishedArticleSlugs(): Promise<Array<{ slug: string }>> {
  const params = new URLSearchParams({ fields: "slug", "filter[status][_eq]": "published", limit: "-1" });
  return directusFetch<Array<{ slug: string }>>("items/articles", params);
}

export function getDirectusAssetUrl(id: string): string {
  return new URL(`assets/${encodeURIComponent(id)}`, getDirectusUrl()).toString();
}

export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Moscow" }).format(new Date(value));
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getPublishedArticles } from "@/lib/directus/articles";
import { DEFAULT_OG_IMAGE, getCanonicalUrl } from "@/lib/seo";
import type { Article } from "@/types/content";

const title = "Статьи об оценке буддийских артефактов";
const description = "Материалы X-Buddha об атрибуции, оценке и сохранении буддийских статуэток и артефактов.";
const canonicalUrl = getCanonicalUrl("/blog/");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: { title, description, url: canonicalUrl, type: "website", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE.url] },
};
export const revalidate = 300;

export default async function BlogPage() {
  let articles: Article[] = [];
  let isUnavailable = false;

  try {
    articles = await getPublishedArticles();
  } catch (error) {
    isUnavailable = true;
    console.error("Unable to load published articles from Directus.", error);
  }

  return (
    <>
      <main className="min-h-screen pb-24 pt-32 sm:pt-40">
        <Container>
        <p className="eyebrow">База знаний</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-.05em] text-milk sm:text-7xl">Статьи</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">Заметки об атрибуции, оценке и бережном обращении с буддийскими предметами.</p>
        <div className="mt-16">
          {isUnavailable ? <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-muted" role="status">Статьи временно недоступны. Пожалуйста, попробуйте позже.</p> : null}
          {!isUnavailable && articles.length === 0 ? <p className="border-t border-white/10 py-8 text-muted">Пока нет опубликованных статей.</p> : null}
          {articles.map((article, index) => <BlogCard key={article.slug} article={article} index={index} />)}
        </div>
        </Container>
      </main>
      <footer className="bg-[#03060b] pb-10"><Container><SiteFooter /></Container></footer>
    </>
  );
}

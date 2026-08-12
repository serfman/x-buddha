import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatArticleDate, getDirectusAssetUrl, getPublishedArticle, getPublishedArticleSlugs } from "@/lib/directus/articles";
import { DEFAULT_OG_IMAGE, SITE_NAME, getCanonicalUrl } from "@/lib/seo";
import type { Article } from "@/types/content";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    return await getPublishedArticleSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getPublishedArticle(slug);
    if (!article) return { title: "Статья не найдена", robots: { index: false, follow: false } };
    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt;
    const socialImage = article.ogImage || article.cover;
    const socialImageUrl = socialImage ? getDirectusAssetUrl(socialImage.id) : DEFAULT_OG_IMAGE.url;
    const canonicalUrl = getCanonicalUrl(`/blog/${encodeURIComponent(article.slug)}/`);
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt || undefined,
        images: [{ url: socialImageUrl, width: socialImage?.width || DEFAULT_OG_IMAGE.width, height: socialImage?.height || DEFAULT_OG_IMAGE.height, alt: socialImage?.description || socialImage?.title || article.title }],
      },
      twitter: { card: "summary_large_image", title, description, images: [socialImageUrl] },
    };
  } catch {
    return { title: "Статья временно недоступна", robots: { index: false, follow: false } };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article: Article | null;
  try {
    article = await getPublishedArticle(slug);
  } catch (error) {
    console.error("Unable to load an article from Directus.", error);
    return <main className="min-h-screen pb-24 pt-36"><Container><div className="mx-auto max-w-3xl"><p className="eyebrow">База знаний</p><h1 className="mt-5 text-4xl font-medium text-milk sm:text-6xl">Статья временно недоступна</h1><p className="mt-5 text-lg leading-8 text-muted">Не удалось связаться с хранилищем статей. Пожалуйста, попробуйте позже.</p><Link href="/blog" className="mt-8 inline-flex text-sm text-cold">← Вернуться к статьям</Link></div></Container></main>;
  }
  if (!article) notFound();
  const description = article.seoDescription || article.excerpt;
  const socialImage = article.ogImage || article.cover;
  const canonicalUrl = getCanonicalUrl(`/blog/${encodeURIComponent(article.slug)}/`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    image: socialImage ? getDirectusAssetUrl(socialImage.id) : getCanonicalUrl(DEFAULT_OG_IMAGE.url),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getCanonicalUrl(),
    },
    inLanguage: "ru-RU",
  };
  return (
    <main className="min-h-screen pb-24 pt-28 sm:pt-36">
      <JsonLd data={structuredData} />
      <Container>
        <nav className="text-sm text-muted" aria-label="Хлебные крошки"><Link href="/" className="hover:text-milk">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-milk">Статьи</Link></nav>
        <article className="mx-auto mt-12 max-w-4xl">
          <p className="eyebrow">База знаний</p>
          <h1 className="mt-5 text-balance text-4xl font-medium leading-tight tracking-[-.045em] text-milk sm:text-6xl">{article.title}</h1>
          <p className="mt-5 text-sm text-muted">{formatArticleDate(article.publishedAt)}</p>
          {article.cover ? <div className="relative mt-12 aspect-[16/7] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c1018]"><Image src={getDirectusAssetUrl(article.cover.id)} alt={article.cover.description || article.cover.title || `Обложка статьи «${article.title}»`} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" /></div> : null}
          <ArticleContent html={article.content} />
          <aside className="mt-16 border-y border-white/10 py-9"><h2 className="text-2xl font-medium text-milk">Оценить предмет</h2><p className="mt-3 max-w-xl leading-7 text-muted">Отправьте фотографии в удобный мессенджер для предварительной оценки.</p><div className="mt-5"><MessengerButtons location="blog" /></div></aside>
          <Link href="/blog" className="mt-10 inline-flex text-sm text-cold">← Вернуться к статьям</Link>
        </article>
      </Container>
    </main>
  );
}

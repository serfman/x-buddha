import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { articles } from "@/data/articles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? { title: article.title, description: article.excerpt, openGraph: { title: article.title, description: article.excerpt, type: "article" } } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <main className="min-h-screen pb-24 pt-28 sm:pt-36">
      <Container>
        <nav className="text-sm text-muted" aria-label="Хлебные крошки"><Link href="/" className="hover:text-milk">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-milk">Статьи</Link></nav>
        <article className="mx-auto mt-12 max-w-4xl">
          <p className="eyebrow">{article.accent}</p>
          <h1 className="mt-5 text-balance text-4xl font-medium leading-tight tracking-[-.045em] text-milk sm:text-6xl">{article.title}</h1>
          <p className="mt-5 text-sm text-muted">{article.date} · {article.readTime}</p>
          <div className="relative mt-12 aspect-[16/7] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_65%_30%,rgba(174,205,232,.18),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(158,117,69,.13),transparent_35%),#0c1018]"><span className="absolute bottom-7 left-7 text-xs uppercase tracking-[.28em] text-cold/60">X-Buddha · Архив</span></div>
          <div className="article-body mt-14">{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>
          <aside className="mt-16 border-y border-white/10 py-9"><h2 className="text-2xl font-medium text-milk">Оценить предмет</h2><p className="mt-3 max-w-xl leading-7 text-muted">Отправьте фотографии в удобный мессенджер для предварительной оценки.</p><div className="mt-5"><MessengerButtons /></div></aside>
          <Link href="/blog" className="mt-10 inline-flex text-sm text-cold">← Вернуться к статьям</Link>
        </article>
      </Container>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { formatArticleDate, getDirectusAssetUrl } from "@/lib/directus/articles";

export function BlogCard({ article, index }: { article: Article; index: number }) {
  return (
    <article className="border-t border-white/10">
      <Link href={`/blog/${article.slug}`} className="group block rounded-xl py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cold focus-visible:ring-offset-4 focus-visible:ring-offset-ink sm:grid sm:grid-cols-[160px_1fr_auto] sm:items-center sm:gap-8" aria-label={`Читать: ${article.title}`}>
        <div className="relative h-24 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(171,204,232,.18),transparent_35%),linear-gradient(135deg,#121824,#090b11)]">
          {article.cover ? <Image src={getDirectusAssetUrl(article.cover.id)} alt={article.cover.description || article.cover.title || `Обложка статьи «${article.title}»`} fill sizes="(min-width: 640px) 160px, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
          <span className="absolute right-3 top-2 text-4xl font-light text-white/[0.18]">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="mt-5 sm:mt-0"><p className="text-xs text-muted">{formatArticleDate(article.publishedAt)}</p><h2 className="mt-2 text-balance text-xl font-medium text-milk transition group-hover:text-cold sm:text-2xl">{article.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{article.excerpt}</p></div>
        <span className="mt-5 inline-flex text-sm text-cold sm:mt-0">Читать →</span>
      </Link>
    </article>
  );
}

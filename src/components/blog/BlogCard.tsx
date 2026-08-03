import Link from "next/link";
import type { Article } from "@/types/content";

export function BlogCard({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group border-t border-white/10 py-8 sm:grid sm:grid-cols-[160px_1fr_auto] sm:items-center sm:gap-8">
      <div className="relative h-24 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(171,204,232,.18),transparent_35%),linear-gradient(135deg,#121824,#090b11)]"><span className="absolute bottom-3 left-3 text-xs uppercase tracking-[.18em] text-cold/70">{article.accent}</span><span className="absolute right-3 top-2 text-4xl font-light text-white/[0.06]">0{index + 1}</span></div>
      <div className="mt-5 sm:mt-0"><p className="text-xs text-muted">{article.date} · {article.readTime}</p><h2 className="mt-2 text-balance text-xl font-medium text-milk transition group-hover:text-cold sm:text-2xl">{article.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{article.excerpt}</p></div>
      <Link href={`/blog/${article.slug}`} className="mt-5 inline-flex text-sm text-cold sm:mt-0" aria-label={`Читать: ${article.title}`}>Читать →</Link>
    </article>
  );
}

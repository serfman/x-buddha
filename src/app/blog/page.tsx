import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { articles } from "@/data/articles";

export const metadata: Metadata = { title: "Статьи", description: "Материалы X-Buddha об атрибуции, оценке и сохранении буддийских артефактов." };

export default function BlogPage() {
  return (
    <main className="min-h-screen pb-24 pt-32 sm:pt-40">
      <Container>
        <p className="eyebrow">База знаний</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-.05em] text-milk sm:text-7xl">Статьи</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">Заметки об атрибуции, оценке и бережном обращении с буддийскими предметами.</p>
        <div className="mt-16">{articles.map((article, index) => <BlogCard key={article.slug} article={article} index={index} />)}</div>
      </Container>
    </main>
  );
}

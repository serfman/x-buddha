import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { StatueSlider } from "@/components/slider/StatueSlider";
import { sliderImages } from "@/lib/assets";
import { site } from "@/data/site";

export function HeroSection() {
  return (
    <section className="hero-exhibition relative flex min-h-svh items-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20" aria-labelledby="hero-title">
      <div className="star-field absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cold/[0.06] blur-3xl" aria-hidden="true" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-8 xl:gap-14">
        <div className="z-10 max-w-2xl">
          <p className="eyebrow">{site.label}</p>
          <h1 id="hero-title" className="type-h1 mt-5 text-balance">
            <span className="block text-milk/75">{site.title.lead}</span>{" "}
            <span className="hero-title-accent block">{site.title.accent}</span>{" "}
            <span className="block text-milk">{site.title.tail}</span>
          </h1>
          <p className="type-display mt-6 text-milk/90">{site.description}</p>
          <p className="type-body mt-2 max-w-xl text-muted">{site.services}</p>
          <div className="mt-7 grid gap-3 border-l border-cold/25 pl-5 sm:grid-cols-3 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-5">
            {site.benefits.map((benefit) => (
              <p key={benefit.title} className="text-sm leading-6 text-muted"><strong className="font-medium text-milk">{benefit.title}:</strong> {benefit.text}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="#process" className="rounded-full bg-milk px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(190,220,255,.2)]">Оценить предмет</Link>
            <MessengerButtons compact location="hero" />
          </div>
        </div>
        <StatueSlider images={sliderImages} />
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { site } from "@/data/site";

export function EvaluationProcessSection() {
  return (
    <section id="process" className="process-orbit relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Три простых шага" title={site.process.title} description={site.process.description} />
        <ol className="process-orbit__steps relative mt-14 grid gap-8 lg:grid-cols-3 lg:gap-0">
          <span className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-cold/45 via-cold/20 to-transparent lg:block" aria-hidden="true" />
          {site.process.steps.map((step, index) => (
            <li key={step} className="relative pr-7 lg:pr-14">
              <span className="relative z-10 inline-flex size-16 items-center bg-panel/90 text-5xl font-light tracking-[-.08em] text-cold/80">0{index + 1}</span>
              <p className="mt-6 max-w-sm text-base leading-7 text-muted">{step}</p>
            </li>
          ))}
        </ol>
        <div id="contact" className="relative mt-14 overflow-hidden rounded-[2rem] border border-cold/20 bg-[linear-gradient(125deg,rgba(191,213,231,.11),rgba(255,255,255,.025)_52%,rgba(178,138,85,.08))] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:px-9 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <span className="pointer-events-none absolute -right-20 -top-28 size-64 rounded-full border border-cold/10 shadow-[0_0_90px_rgba(191,213,231,.08)]" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="text-balance text-2xl font-medium tracking-[-.035em] text-milk sm:text-3xl">{site.process.cta}</p>
            <p className="mt-3 text-base leading-7 text-milk/85">{site.process.ctaHint}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{site.process.confidentiality}</p>
          </div>
          <div className="relative mt-7 lg:mt-0">
            <MessengerButtons prominent location="how_to" />
          </div>
        </div>
      </Container>
    </section>
  );
}

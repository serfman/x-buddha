import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { footerImages, himalayaImage } from "@/lib/assets";
import { getAdminUrl } from "@/lib/admin";
import { site } from "@/data/site";

export function FinalSection() {
  const adminUrl = getAdminUrl();

  return (
    <footer className="final-exhibition relative overflow-hidden" aria-labelledby="final-title">
      <Image
        src={himalayaImage}
        alt="Гималаи под звёздным небом"
        fill
        sizes="100vw"
        className="final-exhibition__himalayas object-cover"
      />
      <div className="final-exhibition__shade absolute inset-0" />
      <Container className="relative flex min-h-[760px] flex-col justify-between pb-24 pt-12 sm:pb-10 sm:pt-16 lg:min-h-[820px] lg:pt-20">
        <div className="final-exhibition__offer grid items-center gap-10 lg:grid-cols-[minmax(0,.82fr)_minmax(360px,.58fr)] lg:gap-20">
          <div className="max-w-xl py-4 lg:py-16">
            <h2 id="final-title" className="text-balance text-4xl font-medium tracking-[-.05em] text-white sm:text-5xl lg:text-6xl">{site.final.title}</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">{site.final.cta}</p>
            <div className="final-exhibition__contacts mt-8"><MessengerButtons dark location="final" /></div>
          </div>
          <div className="final-exhibition__thangka relative mx-auto aspect-[.76] w-full max-w-[310px] overflow-hidden rounded-[.45rem] border sm:max-w-[350px] lg:mr-4 lg:max-w-[390px] lg:rotate-[1.5deg]">
            <Image
              src={footerImages[0]}
              alt="Тханка в традиционном обрамлении"
              fill
              sizes="(max-width: 639px) 78vw, (max-width: 1023px) 350px, 390px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="final-exhibition__footer mt-16 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Logo light />
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65" aria-label="Ссылки в подвале">
              <Link href="/blog">Статьи</Link>
              <Link href="/offer">Публичная оферта</Link>
              <Link href="/privacy">Политика конфиденциальности</Link>
              {adminUrl ? (
                <a
                  href={adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Админ-панель"
                  className="-m-3 flex size-11 items-center justify-center rounded-full text-white/45 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080d]"
                >
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.6 3.5h4.8l.5 2a7.3 7.3 0 0 1 1.4.8l2-.6 2.4 4.1-1.5 1.4a7.5 7.5 0 0 1 0 1.6l1.5 1.4-2.4 4.1-2-.6a7.3 7.3 0 0 1-1.4.8l-.5 2H9.6l-.5-2a7.3 7.3 0 0 1-1.4-.8l-2 .6-2.4-4.1 1.5-1.4a7.5 7.5 0 0 1 0-1.6L3.3 9.8l2.4-4.1 2 .6a7.3 7.3 0 0 1 1.4-.8l.5-2Z" />
                    <circle cx="12" cy="12" r="2.75" />
                  </svg>
                </a>
              ) : null}
            </nav>
          </div>
          <p className="mt-6 text-xs text-white/45">X-Buddha © 2026. Все права защищены.</p>
        </div>
      </Container>
    </footer>
  );
}

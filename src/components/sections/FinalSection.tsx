import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { footerImages, himalayaImage } from "@/lib/assets";

export function FinalSection() {
  return (
    <footer className="final-exhibition relative min-h-[720px] overflow-hidden border-t border-white/10" aria-labelledby="final-title">
      <Image src={himalayaImage} alt="Гималаи под звёздным небом" fill sizes="100vw" className="final-exhibition__himalayas object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,.96)_0%,rgba(5,7,11,.79)_42%,rgba(5,7,11,.28)_75%),linear-gradient(0deg,rgba(5,7,11,.95)_0%,transparent_45%)]" />
      <div className="final-exhibition__thangka absolute right-[9%] top-[10%] hidden h-[70%] w-[24%] rotate-2 overflow-hidden rounded-[.5rem] border border-white/15 shadow-2xl lg:block"><Image src={footerImages[0]} alt="Тханка в традиционном обрамлении" fill sizes="24vw" className="object-cover" /></div>
      <Container className="relative flex min-h-[720px] flex-col justify-between py-20 sm:py-24">
        <div className="max-w-2xl pt-8 lg:pt-16">
          <p className="eyebrow">Завершение экспозиции</p>
          <h2 id="final-title" className="mt-5 text-balance text-4xl font-medium tracking-[-.05em] text-white sm:text-5xl lg:text-6xl">Узнайте историю и ценность вашего предмета</h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">Начните с нескольких фотографий. Предварительную оценку можно провести полностью онлайн.</p>
          <div className="mt-8"><MessengerButtons dark /></div>
        </div>
        <div className="mt-20 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><Logo light /><nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65" aria-label="Ссылки в подвале"><Link href="/blog">Статьи</Link><Link href="/offer">Оферта</Link><Link href="/privacy">Политика конфиденциальности</Link></nav></div>
          <p className="mt-6 text-xs text-white/45">X-Buddha © 2026. Все права защищены.</p>
        </div>
      </Container>
    </footer>
  );
}

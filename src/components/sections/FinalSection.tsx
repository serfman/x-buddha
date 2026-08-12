import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";
import { footerImages, himalayaImage } from "@/lib/assets";
import { site } from "@/data/site";

export function FinalSection() {
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
        <SiteFooter className="final-exhibition__footer mt-16" />
      </Container>
    </footer>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/data/site";
import type { ImageAsset } from "@/types/content";

export function StatueSlider({ images }: { images: ImageAsset[] }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), site.slideDuration);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const visible = useMemo(() => {
    if (!hasImages) return [];
    return [-1, 0, 1].map((offset) => images[(active + offset + images.length) % images.length]);
  }, [active, hasImages, images]);

  if (!hasImages) return <div className="aspect-[4/5] rounded-[2rem] border border-white/10 bg-white/[0.03]" aria-label="Изображения скоро появятся" />;

  return (
    <div className="statue-gallery relative mx-auto w-full max-w-[780px]" aria-roledescription="автоматическая карусель" aria-label="Буддийские статуэтки">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cold/20 shadow-[0_0_110px_rgba(149,190,230,.14)]" />
      <div className="hidden h-[570px] grid-cols-[.82fr_1.12fr_.82fr] items-center gap-3 md:grid xl:gap-5">
        {visible.map((image, index) => (
          <div key={`${active}-${image.src}`} className={`statue-gallery__frame relative overflow-hidden border bg-black/30 transition-all duration-1000 ${index === 1 ? "statue-gallery__frame--active z-10 h-[98%] rounded-[1.5rem]" : "h-[76%] rounded-[1.25rem] opacity-55 [transform:perspective(700px)_rotateY(var(--turn))]"}`} style={{ "--turn": index === 0 ? "8deg" : "-8deg" } as React.CSSProperties}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1200px) 25vw, 280px" className="object-cover" priority={active === 0} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
        ))}
      </div>
      <div className="statue-gallery__frame statue-gallery__frame--active relative mx-auto aspect-[4/5] max-h-[430px] overflow-hidden rounded-[1.35rem] border bg-black/30 md:hidden">
        <Image src={images[active].src} alt={images[active].alt} fill sizes="(max-width: 767px) 88vw" className="object-cover transition-opacity duration-700" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
      </div>
      <div className="mt-4 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
        {images.map((_, index) => <span key={index} className={`h-1 rounded-full transition-all ${index === active ? "w-5 bg-cold" : "w-1 bg-white/25"}`} />)}
      </div>
    </div>
  );
}

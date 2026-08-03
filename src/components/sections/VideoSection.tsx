"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

export function VideoSection({ url }: { url: string }) {
  const [active, setActive] = useState(false);
  const canPlay = Boolean(url);
  return (
    <section className="museum-video relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32" aria-labelledby="video-title">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-14">
          <div><p className="eyebrow">Видеоэкспозиция</p><h2 id="video-title" className="mt-4 text-balance text-3xl font-medium tracking-[-.04em] text-milk sm:text-4xl lg:text-5xl">Методы оценки бронзовых фигур Азии</h2><p className="mt-5 leading-7 text-muted">На что обращает внимание специалист при первичном осмотре предмета.</p></div>
          <div className="museum-video__frame relative aspect-video overflow-hidden rounded-[1rem] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(143,178,210,.13),transparent_35%),#090c13]">
            {active && canPlay ? <iframe src={url} title="Методы оценки бронзовых фигур Азии" allow="fullscreen; picture-in-picture" className="absolute inset-0 h-full w-full" /> : (
              <button type="button" disabled={!canPlay} onClick={() => setActive(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-milk disabled:cursor-default" aria-label={canPlay ? "Воспроизвести видео" : "Видео скоро появится"}>
                <span className="grid size-20 place-items-center rounded-full border border-cold/40 bg-cold/[0.08] transition group-enabled:hover:scale-105 group-enabled:hover:bg-cold/[0.14]"><span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-milk" /></span>
                <span className="text-sm tracking-wide text-muted">{canPlay ? "Смотреть видео" : "Видео скоро появится"}</span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

type VideoConfig = {
  eyebrow: string;
  title: string;
  description: string;
  url: string;
  poster: string;
  posterAlt: string;
};

function getRutubeEmbedUrl(value: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const videoId = url.hostname === "rutube.ru"
      ? url.pathname.match(/^\/video\/([a-f0-9]{32})\/?$/i)?.[1]
      : null;

    return videoId ? `https://rutube.ru/play/embed/${videoId}/` : null;
  } catch {
    return null;
  }
}

export function VideoSection({ video }: { video: VideoConfig }) {
  const [active, setActive] = useState(false);
  const embedUrl = getRutubeEmbedUrl(video.url);
  const canPlay = Boolean(embedUrl);
  return (
    <section id="video" className="museum-video relative scroll-mt-20 overflow-hidden border-t border-white/[0.06] pb-20 pt-16 sm:pb-28 sm:pt-20 lg:pt-24" aria-labelledby="video-title">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-14 xl:gap-20">
          <div className="museum-video__intro max-w-xl">
            <p className="eyebrow">{video.eyebrow}</p>
            <h2 id="video-title" className="type-h2 mt-4 text-balance text-milk">{video.title}</h2>
            <p className="type-body mt-5 text-pretty text-muted">{video.description}</p>
          </div>
          <div className="museum-video__frame relative aspect-video overflow-hidden rounded-[1rem] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(143,178,210,.13),transparent_35%),#090c13]">
            {active && embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button type="button" disabled={!canPlay} onClick={() => setActive(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-milk disabled:cursor-default" aria-label={`Смотреть видео: ${video.title}`}>
                <Image src={video.poster} alt={video.posterAlt} fill sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw" className="object-cover transition duration-700 group-enabled:group-hover:scale-[1.015]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/25" aria-hidden="true" />
                <span className="relative grid size-16 place-items-center rounded-full border border-white/55 bg-black/45 shadow-[0_12px_36px_rgba(0,0,0,.38)] backdrop-blur-sm transition duration-300 group-enabled:group-hover:scale-105 group-enabled:group-hover:bg-black/60 sm:size-20"><span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-milk" /></span>
                <span className="relative rounded-full bg-black/45 px-4 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-sm">{canPlay ? "Смотреть видео" : "Видео скоро появится"}</span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

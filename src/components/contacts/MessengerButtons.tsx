"use client";

import { messengers } from "@/data/messengers";
import { trackMessengerClick, type MessengerCtaLocation } from "@/lib/analytics";

export function MessengerButtons({ compact = false, dark = false, prominent = false, location }: { compact?: boolean; dark?: boolean; prominent?: boolean; location: MessengerCtaLocation }) {
  return (
    <div className={prominent ? "grid w-full gap-3 sm:grid-cols-2 lg:w-auto" : "flex flex-wrap gap-2.5"} aria-label="Связаться в мессенджере">
      {messengers.map((messenger) => (
        <a
          key={messenger.name}
          href={messenger.href}
          target="_blank"
          rel="noopener noreferrer"
          title={messenger.note}
          onClick={() => trackMessengerClick(messenger.name, location)}
          className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm transition duration-300 hover:-translate-y-0.5 ${
            prominent
              ? messenger.name === "Telegram"
                ? "min-h-14 border-milk bg-milk px-7 py-3.5 font-semibold text-ink shadow-[0_12px_38px_rgba(191,213,231,.16)] hover:shadow-[0_16px_44px_rgba(191,213,231,.24)]"
                : "min-h-14 border-cold/45 bg-cold/[0.08] px-7 py-3.5 font-semibold text-milk hover:border-cold/75 hover:bg-cold/[0.13]"
              : dark
                ? "border-white/20 bg-black/20 px-3 py-2 text-white hover:border-white/45"
                : "border-white/15 bg-white/[0.04] px-3 py-2 text-milk hover:border-cold/55 hover:bg-cold/[0.07]"
          } ${prominent ? "" : compact ? "sm:px-3" : "sm:px-4"}`}
        >
          <span className={`grid place-items-center rounded-full border border-current/25 font-semibold tracking-wide ${prominent ? "size-8 text-[11px]" : "size-7 text-[10px]"} ${prominent && messenger.name === "Telegram" ? "text-ink" : "text-cold"}`}>{messenger.short}</span>
          <span>{messenger.name}</span>
        </a>
      ))}
    </div>
  );
}

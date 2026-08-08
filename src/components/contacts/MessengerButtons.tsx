"use client";

import { messengers } from "@/data/messengers";
import { trackMessengerClick, type MessengerCtaLocation } from "@/lib/analytics";

export function MessengerButtons({ compact = false, dark = false, location }: { compact?: boolean; dark?: boolean; location: MessengerCtaLocation }) {
  return (
    <div className="flex flex-wrap gap-2.5" aria-label="Связаться в мессенджере">
      {messengers.map((messenger) => (
        <a
          key={messenger.name}
          href={messenger.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={messenger.note}
          onClick={() => trackMessengerClick(messenger.name, location)}
          className={`group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition duration-300 hover:-translate-y-0.5 ${
            dark ? "border-white/20 bg-black/20 text-white hover:border-white/45" : "border-white/15 bg-white/[0.04] text-milk hover:border-cold/55 hover:bg-cold/[0.07]"
          } ${compact ? "sm:px-3" : "sm:px-4"}`}
        >
          <span className="grid size-7 place-items-center rounded-full border border-current/25 text-[10px] font-semibold tracking-wide text-cold">{messenger.short}</span>
          <span className={compact ? "hidden sm:inline" : ""}>{messenger.name}</span>
        </a>
      ))}
    </div>
  );
}

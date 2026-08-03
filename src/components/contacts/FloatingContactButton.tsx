"use client";

import { useEffect, useRef, useState } from "react";
import { messengers } from "@/data/messengers";

export function FloatingContactButton() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 rounded-full bg-milk px-5 py-3.5 text-sm font-semibold text-ink shadow-[0_12px_40px_rgba(0,0,0,.45)] md:hidden">Написать</button>
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden" role="presentation">
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Закрыть окно" />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title" className="absolute inset-x-0 bottom-0 rounded-t-[2rem] border-t border-white/15 bg-[#10141c] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
            <div className="flex items-center justify-between"><h2 id="contact-sheet-title" className="text-xl font-medium text-milk">Выберите мессенджер</h2><button ref={closeRef} onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-white/15 text-xl text-muted" aria-label="Закрыть">×</button></div>
            <div className="mt-5 grid gap-3">{messengers.map((messenger) => <a key={messenger.name} href={messenger.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-milk"><span className="grid size-9 place-items-center rounded-full border border-cold/30 text-xs font-semibold text-cold">{messenger.short}</span>{messenger.name}</a>)}</div>
          </div>
        </div>
      )}
    </>
  );
}

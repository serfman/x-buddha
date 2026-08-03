"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  { href: "/#evaluation", label: "Оценка" },
  { href: "/#process", label: "Как оценить" },
  { href: "/blog", label: "Статьи" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled || open ? "border-white/10 bg-[#080b12]/90 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-site items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm text-muted transition hover:text-milk">{link.label}</Link>)}
        </nav>
        <Link href="/#contact" className="hidden rounded-full bg-milk px-5 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(190,220,255,.2)] md:inline-flex">Написать</Link>
        <button onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-full border border-white/15 md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Закрыть меню" : "Открыть меню"}>
          <span className="relative h-4 w-5" aria-hidden="true"><span className={`absolute left-0 top-1 h-px w-5 bg-milk transition ${open ? "translate-y-1 rotate-45" : ""}`} /><span className={`absolute bottom-1 left-0 h-px w-5 bg-milk transition ${open ? "-translate-y-1 -rotate-45" : ""}`} /></span>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="border-t border-white/10 px-5 py-5 md:hidden" aria-label="Мобильная навигация">
          <div className="mx-auto flex max-w-site flex-col">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-4 text-lg text-milk">{link.label}</Link>)}
            <Link href="/#contact" onClick={() => setOpen(false)} className="mt-5 rounded-full bg-milk px-5 py-3 text-center font-medium text-ink">Написать</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

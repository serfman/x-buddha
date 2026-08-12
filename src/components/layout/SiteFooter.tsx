import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { getAdminUrl } from "@/lib/admin";

export function SiteFooter({ className = "" }: { className?: string }) {
  const adminUrl = getAdminUrl();

  return (
    <div className={`site-footer ${className}`.trim()}>
      <div className="site-footer__content border-t border-white/15 pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Logo light />
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65" aria-label="Ссылки в подвале">
              <Link href="/blog" className="inline-flex min-h-11 items-center">Статьи</Link>
              <Link href="/privacy" className="inline-flex min-h-11 items-center">Политика конфиденциальности</Link>
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
    </div>
  );
}

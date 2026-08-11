"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";

const CONSENT_STORAGE_KEY = "x-buddha.analytics-consent";
const CONSENT_VERSION = 3;

type ConsentDecision = "accepted" | "rejected";

type StoredConsent = {
  decision: ConsentDecision;
  version: number;
};

let memoryConsent: ConsentDecision | null = null;

function readStoredConsent(): ConsentDecision | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!value) return memoryConsent;

    const consent = JSON.parse(value) as Partial<StoredConsent>;
    if (
      consent.version !== CONSENT_VERSION ||
      (consent.decision !== "accepted" && consent.decision !== "rejected")
    ) {
      return null;
    }

    return consent.decision;
  } catch {
    return null;
  }
}

export function AnalyticsConsent() {
  const [decision, setDecision] = useState<ConsentDecision | "loading" | null>("loading");

  useEffect(() => {
    const syncConsent = () => setDecision(readStoredConsent());
    const timer = window.setTimeout(syncConsent, 0);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  const saveDecision = (nextDecision: ConsentDecision) => {
    memoryConsent = nextDecision;

    try {
      const consent: StoredConsent = {
        decision: nextDecision,
        version: CONSENT_VERSION,
      };
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // The current-page decision still applies when browser storage is unavailable.
    }

    setDecision(nextDecision);
  };

  return (
    <>
      {decision === "accepted" ? <YandexMetrika /> : null}
      {decision === null ? (
        <aside
          className="fixed inset-x-3 bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#0b1018]/95 p-4 shadow-[0_20px_70px_rgba(0,0,0,.6)] backdrop-blur-xl sm:inset-x-6 sm:p-5"
          aria-label="Настройки аналитических cookie"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              Мы используем файлы cookie и Яндекс.Метрику для анализа работы сайта. Метрика
              включится только с вашего согласия. Подробнее — в{" "}
              <Link
                href="/privacy"
                className="text-cold underline decoration-cold/45 underline-offset-4 hover:text-white"
              >
                Политике конфиденциальности
              </Link>
              .
            </p>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => saveDecision("rejected")}
                className="min-h-11 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/[0.06]"
              >
                Отклонить
              </button>
              <button
                type="button"
                onClick={() => saveDecision("accepted")}
                className="min-h-11 rounded-full border border-milk bg-milk px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
              >
                Принять
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}

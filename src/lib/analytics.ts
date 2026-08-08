export const analyticsGoals = {
  Telegram: "messenger_telegram_click",
  MAX: "messenger_max_click",
} as const;

export type MessengerCtaLocation = "hero" | "how_to" | "final" | "mobile_sheet" | "blog";

type YandexMetrika = (
  counterId: number,
  method: "reachGoal" | "hit",
  target: string,
  params?: { location?: MessengerCtaLocation; title?: string },
) => void;

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

export function getYandexMetrikaId(): number | null {
  const value = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

export function trackMessengerClick(
  messenger: keyof typeof analyticsGoals,
  location: MessengerCtaLocation,
): void {
  const counterId = getYandexMetrikaId();
  if (!counterId || typeof window === "undefined" || !window.ym) return;

  window.ym(counterId, "reachGoal", analyticsGoals[messenger], { location });
}

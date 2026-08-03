import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { FloatingContactButton } from "@/components/contacts/FloatingContactButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://x-buddha.ru"),
  title: { default: "X-Buddha — оценка буддийских артефактов", template: "%s — X-Buddha" },
  description: "Оценка, атрибуция и экспертиза буддийских статуэток и артефактов.",
  openGraph: { title: "X-Buddha", description: "Экспертная оценка буддийских статуэток и артефактов.", type: "website", locale: "ru_RU" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><Header />{children}<FloatingContactButton /></body></html>;
}

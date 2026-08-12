import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { FloatingContactButton } from "@/components/contacts/FloatingContactButton";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { DEFAULT_OG_IMAGE, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, getSiteUrl } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: HOME_TITLE, template: `%s — ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "ru_RU",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={manrope.variable}><Header />{children}<FloatingContactButton /><AnalyticsConsent /></body></html>;
}

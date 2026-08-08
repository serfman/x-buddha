import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { EvaluationFactorsSection } from "@/components/sections/EvaluationFactorsSection";
import { EvaluationProcessSection } from "@/components/sections/EvaluationProcessSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { FinalSection } from "@/components/sections/FinalSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { DEFAULT_OG_IMAGE, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, getCanonicalUrl } from "@/lib/seo";

const canonicalUrl = getCanonicalUrl();

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: canonicalUrl,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonicalUrl}#organization`,
        name: SITE_NAME,
        url: canonicalUrl,
        description: HOME_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl}#website`,
        url: canonicalUrl,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: "ru-RU",
        publisher: { "@id": `${canonicalUrl}#organization` },
      },
    ],
  };

  return (
    <main className="home-exhibition">
      <JsonLd data={structuredData} />
      <HeroSection />
      <EvaluationFactorsSection />
      <EvaluationProcessSection />
      <div className="final-journey">
        <VideoSection url={site.rutubeUrl} />
        <FinalSection />
      </div>
    </main>
  );
}

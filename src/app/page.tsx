import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { EvaluationFactorsSection } from "@/components/sections/EvaluationFactorsSection";
import { EvaluationProcessSection } from "@/components/sections/EvaluationProcessSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { FinalSection } from "@/components/sections/FinalSection";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Оценка буддийских статуэток", description: "Оценка, выкуп, атрибуция, экспертиза и размещение буддийских артефактов на аукционе." };

export default function Home() {
  return <main className="home-exhibition"><HeroSection /><EvaluationFactorsSection /><EvaluationProcessSection /><VideoSection url={site.rutubeUrl} /><FinalSection /></main>;
}

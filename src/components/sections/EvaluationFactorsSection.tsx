import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { evaluationFactors } from "@/data/evaluation-factors";
import { centerImage } from "@/lib/assets";
import type { EvaluationFactor } from "@/types/content";

function FactorCopy({ factor, desktop = false }: { factor: EvaluationFactor; desktop?: boolean }) {
  return (
    <div className={`relative ${desktop ? `evaluation-factor-copy evaluation-factor-copy--${factor.side}` : ""}`}>
      <span className="text-xs tracking-[.2em] text-cold">{factor.number}</span>
      <h3 className="mt-1 text-lg font-medium text-milk">{factor.title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted">{factor.description}</p>
    </div>
  );
}

function MarkerGlow({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x} cy={y} r="2.35" fill="rgba(164,201,233,.13)" />
      <circle cx={x} cy={y} r="0.9" fill="#c5ddf2" />
    </>
  );
}

function DesktopSpecimenOverlay() {
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-20 size-full" aria-hidden="true">
      {evaluationFactors.map((factor) => {
        const marker = factor.marker;
        const startX = factor.side === "left" ? 0 : 100;
        const bendX = factor.side === "left" ? 18 : 82;

        if (marker.kind === "dimension") {
          const middleY = (marker.topY + marker.bottomY) / 2;
          return (
            <g key={factor.number}>
              <path d={`M ${startX} ${factor.lineAnchorY} L 96 ${factor.lineAnchorY} L ${marker.x} ${middleY}`} className="evaluation-marker-line" />
              <path d={`M ${marker.x - 3.5} ${marker.topY} H ${marker.x + 3.5} M ${marker.x} ${marker.topY} V ${marker.bottomY} M ${marker.x - 3.5} ${marker.bottomY} H ${marker.x + 3.5}`} className="evaluation-dimension-line" />
            </g>
          );
        }

        return (
          <g key={factor.number}>
            <path d={`M ${startX} ${factor.lineAnchorY} L ${bendX} ${factor.lineAnchorY} L ${marker.x} ${marker.y}`} className="evaluation-marker-line" />
            <MarkerGlow x={marker.x} y={marker.y} />
          </g>
        );
      })}
    </svg>
  );
}

function MobileMarkers() {
  return (
    <>
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-10 size-full" aria-hidden="true">
        {evaluationFactors.map((factor) => {
          if (factor.marker.kind !== "dimension") return null;
          const { x, topY, bottomY } = factor.marker;
          return <path key={factor.number} d={`M ${x - 3.5} ${topY} H ${x + 3.5} M ${x} ${topY} V ${bottomY} M ${x - 3.5} ${bottomY} H ${x + 3.5}`} className="evaluation-dimension-line" />;
        })}
      </svg>
      {evaluationFactors.map((factor) => {
        const marker = factor.marker;
        const left = marker.x;
        const top = marker.kind === "point" ? marker.y : (marker.topY + marker.bottomY) / 2;
        return (
          <span key={factor.number} className={`evaluation-mobile-marker ${marker.kind === "dimension" ? "evaluation-mobile-marker--dimension" : ""}`} style={{ left: `${left}%`, top: `${top}%` }}>
            {factor.number}
          </span>
        );
      })}
    </>
  );
}

export function EvaluationFactorsSection() {
  const leftFactors = evaluationFactors.filter((factor) => factor.side === "left");
  const rightFactors = evaluationFactors.filter((factor) => factor.side === "right");

  return (
    <section id="evaluation" className="evaluation-lab relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(109,151,190,.1),transparent_34%)]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading eyebrow="Принципы атрибуции" title="Факторы оценки статуэтки" description="От чего зависит стоимость вашей фигурки: цена каждого предмета индивидуальна и складывается из множества факторов." align="center" />

        <div className="evaluation-lab__diagram relative mt-16 hidden grid-cols-[minmax(0,1fr)_minmax(0,46%)_minmax(0,1fr)] items-stretch lg:grid">
          <div className="z-30 grid grid-rows-3 text-right">
            {leftFactors.map((factor) => <FactorCopy key={factor.number} factor={factor} desktop />)}
          </div>
          <div className="evaluation-lab__specimen relative z-10 aspect-square w-full">
            <div className="absolute inset-[4%] rounded-full border border-cold/15 shadow-[0_0_80px_rgba(137,181,219,.1)]" />
            <Image src={centerImage} alt="Многофигурная бронзовая буддийская статуэтка" fill sizes="(max-width: 1200px) 46vw, 552px" className="artifact-specimen-image object-contain mix-blend-lighten" />
            <DesktopSpecimenOverlay />
          </div>
          <div className="z-30 grid grid-rows-3">
            {rightFactors.map((factor) => <FactorCopy key={factor.number} factor={factor} desktop />)}
          </div>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="evaluation-lab__specimen relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="absolute inset-[6%] rounded-full border border-cold/15" />
            <Image src={centerImage} alt="Многофигурная бронзовая буддийская статуэтка" fill sizes="(max-width: 768px) 95vw, 560px" className="artifact-specimen-image object-contain mix-blend-lighten" />
            <MobileMarkers />
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {evaluationFactors.map((factor) => <FactorCopy key={factor.number} factor={factor} />)}
          </div>
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { evaluationFactors } from "@/data/evaluation-factors";
import { centerImage } from "@/lib/assets";

function FactorCopy({ index }: { index: number }) {
  const factor = evaluationFactors[index];
  return (
    <div className="relative">
      <span className="text-xs tracking-[.2em] text-cold">{factor.number}</span>
      <h3 className="mt-1 text-lg font-medium text-milk">{factor.title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted">{factor.description}</p>
    </div>
  );
}

export function EvaluationFactorsSection() {
  return (
    <section id="evaluation" className="evaluation-lab relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(109,151,190,.1),transparent_34%)]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading eyebrow="Принципы атрибуции" title="Факторы оценки статуэтки" description="От чего зависит стоимость вашей фигурки: цена каждого предмета индивидуальна и складывается из множества факторов." align="center" />

        <div className="evaluation-lab__diagram relative mt-16 hidden min-h-[760px] grid-cols-[1fr_1.3fr_1fr] items-center gap-9 lg:grid">
          <div className="z-10 flex h-[610px] flex-col justify-between py-9 text-right">{[0, 1, 2].map((index) => <FactorCopy key={index} index={index} />)}</div>
          <div className="evaluation-lab__specimen relative z-10 mx-auto aspect-square w-full max-w-[590px]">
            <div className="absolute inset-[4%] rounded-full border border-cold/15 shadow-[0_0_80px_rgba(137,181,219,.1)]" />
            <Image src={centerImage} alt="Центральная статуэтка для схемы факторов оценки" fill sizes="590px" className="artifact-specimen-image object-contain mix-blend-lighten" />
          </div>
          <div className="z-10 flex h-[610px] flex-col justify-between py-9">{[3, 4, 5].map((index) => <FactorCopy key={index} index={index} />)}</div>
          <svg viewBox="0 0 1200 720" className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true">
            {evaluationFactors.map((factor, index) => {
              const x = factor.point.x * 12;
              const y = factor.point.y * 7.2;
              const endX = factor.side === "left" ? 325 : 875;
              const bendX = factor.side === "left" ? 420 : 780;
              const endY = 94 + (index % 3) * 257;
              return <g key={factor.number}><path d={`M ${x} ${y} L ${bendX} ${endY} L ${endX} ${endY}`} fill="none" stroke="rgba(164,201,233,.38)" strokeWidth="1" /><circle cx={x} cy={y} r="5" fill="#c5ddf2" /><circle cx={x} cy={y} r="13" fill="rgba(164,201,233,.12)" /></g>;
            })}
            <path d="M 874 150 L 910 150 M 892 150 L 892 580 M 874 580 L 910 580" fill="none" stroke="rgba(190,151,103,.6)" strokeWidth="1" />
          </svg>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="evaluation-lab__specimen relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="absolute inset-[6%] rounded-full border border-cold/15" />
            <Image src={centerImage} alt="Статуэтка с маркерами факторов оценки" fill sizes="(max-width: 768px) 95vw, 560px" className="artifact-specimen-image object-contain mix-blend-lighten" />
            {evaluationFactors.map((factor) => <span key={factor.number} className="absolute z-10 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cold/50 bg-ink/85 text-[11px] font-medium text-cold shadow-[0_0_18px_rgba(164,201,233,.18)]" style={{ left: `${factor.point.x}%`, top: `${factor.point.y}%` }}>{factor.number}</span>)}
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">{evaluationFactors.map((_, index) => <FactorCopy key={index} index={index} />)}</div>
        </div>
      </Container>
    </section>
  );
}

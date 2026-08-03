import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Оферта", description: "Временная страница публичной оферты X-Buddha." };

export default function OfferPage() {
  return <main className="min-h-screen pb-24 pt-36"><Container><div className="mx-auto max-w-3xl"><p className="eyebrow">Юридическая информация</p><h1 className="mt-5 text-4xl font-medium tracking-[-.04em] text-milk sm:text-6xl">Публичная оферта</h1><div className="legal-note mt-10"><strong>Временный текст.</strong> До публикации сайта этот раздел необходимо заменить документом, подготовленным юристом под фактическую модель работы X-Buddha.</div><div className="article-body mt-10"><h2>Общие положения</h2><p>Настоящая страница демонстрирует структуру юридического раздела frontend-прототипа и не является действующей публичной офертой.</p><h2>Условия оказания услуг</h2><p>Состав услуг, порядок оценки, оплаты и передачи предметов будут определены в финальной редакции документа.</p></div></div></Container></main>;
}

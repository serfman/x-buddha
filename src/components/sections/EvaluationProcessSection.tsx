import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MessengerButtons } from "@/components/contacts/MessengerButtons";

const steps = [
  "Сделайте несколько чётких фотографий с разных ракурсов. Обязательно: основание, лицо, детали крупным планом.",
  "Прикрепите фотографии к сообщению и отправьте в удобный мессенджер.",
  "Напишите известную информацию: размеры, вес, история происхождения.",
];

export function EvaluationProcessSection() {
  return (
    <section id="process" className="process-orbit relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Три простых шага" title="Как узнать стоимость прямо сейчас?" description="Вам не нужно никуда ехать. Оценка проходит полностью онлайн." />
        <ol className="process-orbit__steps relative mt-14 grid gap-8 lg:grid-cols-3 lg:gap-0">
          <span className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-cold/45 via-cold/20 to-transparent lg:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <li key={step} className="relative pr-7 lg:pr-14">
              <span className="relative z-10 inline-flex size-16 items-center bg-panel/90 text-5xl font-light tracking-[-.08em] text-cold/80">0{index + 1}</span>
              <p className="mt-6 max-w-sm text-base leading-7 text-muted">{step}</p>
            </li>
          ))}
        </ol>
        <div id="contact" className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xl font-medium text-milk">Пишите в сообщения прямо сейчас!</p><p className="mt-2 text-sm text-muted">Отвечаю быстро, гарантирую полную конфиденциальность сделки.</p></div>
          <MessengerButtons />
        </div>
      </Container>
    </section>
  );
}

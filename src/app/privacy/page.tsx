import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Политика конфиденциальности", description: "Временная страница политики конфиденциальности X-Buddha.", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <main className="min-h-screen pb-24 pt-36"><Container><div className="mx-auto max-w-3xl"><p className="eyebrow">Юридическая информация</p><h1 className="mt-5 text-balance text-4xl font-medium tracking-[-.04em] text-milk sm:text-6xl">Политика конфиденциальности</h1><div className="legal-note mt-10"><strong>Временный текст.</strong> Перед публикацией требуется юридически выверенная редакция с актуальными реквизитами и описанием обработки данных.</div><div className="article-body mt-10"><h2>Статус страницы</h2><p>В текущем frontend-прототипе формы, регистрация, загрузка файлов и хранение пользовательских данных отсутствуют.</p><h2>Связь через мессенджеры</h2><p>При переходе по ссылке пользователь взаимодействует с выбранным мессенджером на условиях его собственной политики конфиденциальности.</p></div></div></Container></main>;
}

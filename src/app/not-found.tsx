import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-5 text-center"><div><p className="eyebrow">404</p><h1 className="mt-4 text-4xl font-medium text-milk">Страница не найдена</h1><Link href="/" className="mt-8 inline-flex rounded-full bg-milk px-6 py-3 text-sm font-medium text-ink">На главную</Link></div></main>;
}

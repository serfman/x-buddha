import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${light ? "text-white" : "text-milk"}`} aria-label="X-Buddha — на главную">
      <span className="relative grid size-8 place-items-center" aria-hidden="true">
        <span className="absolute inset-[3px] rounded-full border border-cold/35 transition-transform duration-500 group-hover:rotate-45" />
        <span className="text-xl font-light leading-none text-cold">X</span>
      </span>
      <span className="text-sm font-semibold tracking-[0.22em]">BUDDHA</span>
    </Link>
  );
}

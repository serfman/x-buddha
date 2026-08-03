type Props = { eyebrow?: string; title: string; description?: string; align?: "left" | "center" };

export function SectionHeading({ eyebrow, title, description, align = "left" }: Props) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 text-balance text-3xl font-medium tracking-[-0.04em] text-milk sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-pretty text-base leading-7 text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

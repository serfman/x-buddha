type Props = { eyebrow?: string; title: string; description?: string; align?: "left" | "center" };

export function SectionHeading({ eyebrow, title, description, align = "left" }: Props) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="type-h2 mt-4 text-balance text-milk">{title}</h2>
      {description && <p className="type-body mt-5 text-pretty text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

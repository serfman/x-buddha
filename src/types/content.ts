export type Messenger = {
  name: "Telegram" | "MAX";
  short: string;
  href: string;
  note: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type ArticleImage = {
  id: string;
  width: number | null;
  height: number | null;
  title: string | null;
  description: string | null;
};

export type Article = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string | null;
  cover: ArticleImage | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: ArticleImage | null;
};

export type EvaluationFactor = {
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
  lineAnchorY: number;
  marker:
    | { kind: "point"; x: number; y: number }
    | { kind: "dimension"; x: number; topY: number; bottomY: number };
};

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

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  accent: string;
  sections: Array<{ heading: string; body: string[] }>;
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

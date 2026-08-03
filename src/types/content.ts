export type Messenger = {
  name: "Telegram" | "WhatsApp" | "MAX";
  short: string;
  href: string;
  note: string;
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
  point: { x: number; y: number };
};

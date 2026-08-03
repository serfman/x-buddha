import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-bg-primary)",
        panel: "var(--color-bg-secondary)",
        milk: "var(--color-text-primary)",
        muted: "var(--color-text-muted)",
        cold: "var(--color-accent-cold)",
        bronze: "var(--color-accent-bronze)",
      },
      maxWidth: { site: "var(--container-width)" },
    },
  },
  plugins: [],
} satisfies Config;

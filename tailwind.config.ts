import type { Config } from "tailwindcss";

// Renkler app/theme.css dosyasından gelir. Paleti değiştirmek için yalnızca o dosyayı düzenleyin.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        paper: v("paper"),
        blush: v("blush"),
        sky: v("sky"),
        butter: v("butter"),
        sage: v("sage"),
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        action: v("action"),
        "action-ink": v("action-ink"),
        accent: v("accent"),
        leaf: v("leaf"),
        ok: v("ok"),
        warn: v("warn"),
        bad: v("bad"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: { blob: "2.5rem" },
      maxWidth: { prose: "65ch" },
    },
  },
  plugins: [],
} satisfies Config;

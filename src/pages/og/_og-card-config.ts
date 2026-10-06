/**
 * Shared visual config for build-time OG cards.
 *
 * Edit this file to retune generated card colors, spacing, and fonts. Both
 * the per-page endpoint (`og/[...slug].ts`) and the homepage fallback
 * (`og.png.ts`) spread this object into `astro-og-canvas`.
 *
 * Leading underscore tells Astro to skip routing for this file — it sits
 * inside `src/pages/` to be next to its consumers, but it's not a route.
 */

import type { OGImageOptions } from "astro-og-canvas";

export const ogCardConfig = {
  // Monospace 深色色票：gray-900 底、orange-500 左邊線（同 h1）
  bgGradient: [
    [17, 17, 17],
    [26, 26, 26],
  ],
  border: { color: [243, 88, 21], width: 8, side: "inline-start" },
  padding: 96,
  // Sarasa Mono TC Bold 子集（ASCII、標點、Big5 常用字），只在建置時使用，不會部署
  fonts: ["./src/assets/fonts/SarasaMonoTC-Bold-og.ttf"],
  font: {
    title: {
      color: [255, 255, 255],
      size: 64,
      weight: "Bold",
      families: ["Sarasa Mono TC"],
      lineHeight: 1.1,
    },
    description: {
      color: [161, 161, 161],
      size: 32,
      weight: "Bold",
      families: ["Sarasa Mono TC"],
      lineHeight: 1.3,
    },
  },
  format: "PNG",
} satisfies Partial<OGImageOptions>;

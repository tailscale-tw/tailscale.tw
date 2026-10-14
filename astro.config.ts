import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";
import { createSitemapSerialize } from "./src/lib/sitemap-lastmod";

const nimbusConfig = defineNimbusConfig({
  // Canonical origin. Drives canonical URLs, absolute OG image URLs,
  // robots.txt, sitemap, and the links in /llms.txt.
  site: "https://tailscale.tw",
  title: "tailscale.tw 社群筆記",
  description:
    "分享 Tailscale 在 PVE 與 Synology 上的使用心得、小祕技與安裝教學。",
  locale: "zh-TW",
  github: "https://github.com/tailscale-tw/tailscale.tw",
  editPattern: "https://github.com/tailscale-tw/tailscale.tw/edit/main/{path}",
  socialImageAlt: "tailscale.tw 社群筆記預覽圖",
});

export default defineConfig({
  // nimbus:adapter
  output: "static",
  // Tailwind v4 via its Vite plugin (the integration Astro recommends for
  // Tailwind v4 — replaces the PostCSS plugin, which doesn't build under
  // Astro 7's Vite 8 bundler).
  vite: {
    plugins: [tailwindcss()],
  },
  // Hover-prefetch link targets so full-page navigations feel instant without
  // a client-side router.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    nimbus(nimbusConfig, {
      // Authoring rules are opt-in by design — your repo, your taste. The
      // two below are the load-bearing pair: frontmatter has to validate
      // against the content schema for the page to render properly, and
      // broken internal links are 404s for your readers. Add the others
      // (heading hierarchy, code-block language, style, etc.) when you're
      // ready to enforce them — see `nimbus-docs lint --help`.
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      // Add <lastmod> to the sitemap for content pages, sourced the same way
      // as the page/JSON-LD dates (frontmatter `lastUpdated` → git). Non-doc
      // URLs keep no lastmod.
      sitemap: {
        serialize: createSitemapSerialize(),
      },
      // Wrap wide tables so they scroll instead of overflowing the page
      // (styled by `.nb-table-scroll` in src/styles/prose.css).
      markdown: {
        hastPlugins: [tableScroll()],
      },
    }),
  ],
});

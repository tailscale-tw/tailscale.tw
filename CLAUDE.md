# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Source for https://tailscale.tw — a 台灣正體中文 documentation site of Tailscale tips. Built with [Nimbus](https://nimbus-docs.com) (Astro 7 + `@cloudflare/nimbus-docs`), restyled after the Monospace theme (shyuan/astro-monospace-theme). `AGENT.md` is Nimbus's own scaffold guide for this project — read it for framework conventions.

## Commands

```sh
bun install
bun run dev          # dev server
bun run build        # static build into dist/ (also builds Pagefind search + OG images)
bun run typecheck    # astro check
bun run lint         # eslint
bun run format       # prettier --write (format:check in CI)
bun run lint:docs    # nimbus-docs lint (frontmatter shape, internal links); lint:docs:fix to autofix
bun run lint:text    # autocorrect: CJK/Latin spacing in src/content/; fix:text to autofix
bun run preview:cf   # build + wrangler dev
```

Bun is the package manager (version pinned by `packageManager` in `package.json`); Astro and wrangler still run on Node 22. There are no unit tests. CI (`.github/workflows/ci.yml`, on PRs) runs `lint:text`, `lint`, `format:check`, then `typecheck`, `build` and `lint:docs` (it needs the routes written by the build) — run these before pushing.

## Architecture

- Content lives in `src/content/docs/**.mdx`; the file path is the URL (`pve/tailscale-on-lxc.mdx` → `/pve/tailscale-on-lxc/`). These URLs match the old MkDocs site — don't rename files without adding redirects.
- Sidebar order and labels come from frontmatter (`sidebar.order`, `sidebar.label`; section `index.mdx` sets `sidebar.group.label`). There is no central nav file. Section `index.mdx` pages also link their children manually.
- Site-wide settings (site URL, title, locale, GitHub/edit link) are in the `defineNimbusConfig` block of `astro.config.ts`.
- `@cloudflare/nimbus-docs` is the imported framework (routing helpers, llms.txt, markdown endpoints, validation). Everything under `src/` (layouts, components, styles) is owned source and can be edited freely.
- Markdown is processed by Sätteri, not unified: remark plugins don't run.

## Styling (Monospace look)

- Design tokens are the `--nb-*` variables in `src/styles/globals.css` (light in `:root`, dark in `[data-mode="dark"]`; update both). Article typography is in `src/styles/prose.css`. Use tokens, not hard-coded colors.
- Font is Sarasa Mono TC, self-hosted as unicode-range splits in `public/fonts/sarasa-mono-tc/` (loaded from `BaseLayout.astro`). Only weights 400 and 700 exist.
- Layout rhythm: 24px line multiples; CJK = 2 columns, Latin = 1. Must not scroll horizontally at 390px.
- OG cards (`src/pages/og/_og-card-config.ts`) use `src/assets/fonts/SarasaMonoTC-Bold-og.ttf`, a build-only subset (ASCII, CJK punctuation, Big5 common characters). Characters outside that set render as missing glyphs in OG images.
- Google Analytics (`G-BD19CZ9G36`) is in `BaseLayout.astro`; because of `ClientRouter`, page views are sent on each `astro:page-load`.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` runs the same checks, builds with bun, then `wrangler deploy` (Workers static assets, config in `wrangler.jsonc`, worker name `tailscale-tw`). Requires repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the token is scoped to the `tailscale-tw` Worker plus Workers Routes / Zone Read on the `tailscale.tw` zone (custom domain is set in `wrangler.jsonc`).

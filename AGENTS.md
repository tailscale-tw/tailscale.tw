# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` only imports this file; keep project instructions here.

## Overview

Source for https://tailscale.tw — a 台灣正體中文 documentation site of Tailscale tips (PVE, Synology, core features, performance tuning). Built with [Nimbus](https://nimbus-docs.com) (Astro 7 + `@cloudflare/nimbus-docs`), static output, deployed to Cloudflare Workers static assets. Restyled after the Monospace theme (shyuan/astro-monospace-theme).

This repo _uses_ Nimbus to publish content; it does not develop Nimbus. The framework is an npm dependency, and everything under `src/` was copied from the Nimbus starter and is ours to edit.

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

Bun is the package manager (version pinned by `packageManager` in `package.json`); Astro and wrangler still run on Node 22. There are no unit tests. CI (`.github/workflows/ci.yml`, on PRs) runs `lint:text`, `lint`, `format:check`, then `typecheck`, `build` and `lint:docs` (it needs `.nimbus/routes.json` written by the build). Run these before pushing.

The Nimbus CLI is `bunx @cloudflare/nimbus-docs <command>` (uses the installed version; the scoped name avoids an unrelated `nimbus-docs` package).

## Layout

```
astro.config.ts          # site settings in defineNimbusConfig (site, title, locale, github, editPattern), lint rules, markdown plugins
nimbus.json              # Nimbus upgrade baseline (lastReviewedNimbusVersion); committed, never hand-edited
wrangler.jsonc           # Worker "tailscale-tw", custom domain tailscale.tw, assets from ./dist
.autocorrectrc           # only the CJK/Latin space-word rule is enabled
public/fonts/sarasa-mono-tc/   # self-hosted Sarasa Mono TC (unicode-range splits)
src/
├── components.ts        # MDX globals: Aside, Card, CardGrid, PackageManagers, Render, Steps/Step, Tabs/TabItem
├── components/          # AgentDirective, Header, Footer, Render + ui/<slug>/ (Nimbus registry components)
├── content/
│   ├── docs/<section>/*.mdx   # sections: features, performance, platforms, pve, synology
│   └── partials/*.mdx         # used via <Render file="..." />
├── content.config.ts    # docsCollection() (+ optional `audience: human`) and partialsCollection()
├── layouts/             # BaseLayout (head, fonts, ClientRouter, GA, AgentDirective), DocsLayout (sidebar/TOC)
├── assets/fonts/        # OG-only font subset
├── pages/               # [...slug] page + .md/.mdx endpoints, llms.txt, per-section llms.txt, og images, robots.txt, 404
└── styles/              # globals.css (tokens), prose.css (article typography)
```

The home page is `src/content/docs/index.mdx` (no `src/pages/index.astro`).

## Writing content

- The file path is the URL: `pve/tailscale-on-lxc.mdx` → `/pve/tailscale-on-lxc/`. These URLs match the old MkDocs site — don't rename or move files without adding redirects.
- Frontmatter: `title` (required; it renders as the H1, so don't repeat it in the body), `description`, `sidebar.order`, `sidebar.label` (shorter sidebar text). There is no central nav file.
- A section is a directory with an `index.mdx` that sets `sidebar.group.label` and a `sidebar.order` that positions the section among the others (currently features `0`, performance `0.5`, ai `0.9`, pve `1`, synology `4`, platforms `5`; pick an unused value for a new section). The section `index.mdx` links its child pages manually; when adding a page, add it to that list too.
- Write in 台灣正體中文 with Taiwan terminology. Put a space between CJK and Latin/digits (`bun run fix:text` applies it).
- New articles start with a version note blockquote, e.g. `> 本文以 Tailscale v1.102（2026 年 10 月）為準…`, stating the Tailscale version and date the content was verified against. Older articles under `pve/` and `synology/` don't have one; don't add it when editing them unless the content is re-verified.
- Internal links are root-relative with a trailing slash: `[Tailscale Serve](/features/serve/)`. `lint:docs` fails on broken ones.
- MDX components are PascalCase. Register a component in `src/components.ts` to use it without an import. Partials go through `<Render file="<slug>" />`; never import `.mdx` directly.
- Icons: `<Icon name="ph:<glyph>" class="w-4 h-4" />` from `@cloudflare/nimbus-docs/components/Icon.astro` (Phosphor glyphs).
- Markdown is processed by Sätteri, not unified: remark/rehype plugins don't run. Extend via `markdown.mdastPlugins` / `markdown.hastPlugins` in `astro.config.ts` (`tableScroll()` is already wired).

## Styling (Monospace look)

- Design tokens are the `--nb-*` variables in `src/styles/globals.css` (light in `:root`, dark in `[data-mode="dark"]`; update both). Article typography is in `src/styles/prose.css`. Use tokens, not hard-coded colors.
- Font is Sarasa Mono TC, self-hosted as unicode-range splits in `public/fonts/sarasa-mono-tc/` (loaded from `BaseLayout.astro`). Only weights 400 and 700 exist.
- Layout rhythm: 24px line multiples; CJK = 2 columns, Latin = 1. Must not scroll horizontally at 390px.
- OG cards (`src/pages/og/_og-card-config.ts`) use `src/assets/fonts/SarasaMonoTC-Bold-og.ttf`, a build-only subset (ASCII, CJK punctuation, Big5 common characters). Characters outside that set render as missing glyphs in OG images, so keep titles within it.
- Google Analytics (`G-BD19CZ9G36`) is in `BaseLayout.astro`; because of `ClientRouter`, page views are sent on each `astro:page-load`. Client scripts must likewise (re)bind on `astro:page-load`.

## Working with Nimbus

- **Registry components** live in `src/components/ui/<slug>/`. Install or upgrade them with `bunx @cloudflare/nimbus-docs add <slug>` (`--overwrite` to upgrade, then review `git diff`) rather than hand-copying, so dependencies resolve. `list` shows what's available; `add <feature> --print` prints a feature recipe without changing files.
- **Preflight**: `bunx @cloudflare/nimbus-docs check` (build-free: config, structure, MDX components, lint rules, types; `--json` for a loop, `--fix` for safe repairs). Run it again after a build for full coverage.
- **Keep `<AgentDirective />`** in `BaseLayout.astro`; it points agents at `/llms.txt` and the page's Markdown version.
- **Upgrading `@cloudflare/nimbus-docs`**:
  1. `bun update @cloudflare/nimbus-docs`.
  2. Preview: `bunx @cloudflare/nimbus-docs migrate --dry-run --diff`; review every entry and resolve manual items. The preview never writes anything, even when no migration remains.
  3. Apply: only with the user's consent, run `migrate --yes` (it can't be combined with `--dry-run`/`--diff`), review the resulting diff, and preview again.
  4. Record: once no plan remains, run `migrate --yes` once more. Only this run writes `lastReviewedNimbusVersion` to `nimbus.json`; stopping at a clean preview leaves the old baseline and replays the same reviews next upgrade. Never edit `nimbus.json` by hand or skip versions.
  5. `bunx @cloudflare/nimbus-docs outdated`, then `diff <file>` for each starter file that changed upstream. Most of `src/` has been restyled, so merge by hand instead of `diff --apply`.
  6. Run `typecheck`, `build`, and `check`.

  `migrate` (except `--print`) exits 1 while review work or the baseline record is pending; that signals an unfinished upgrade, not a command failure.
- Upstream starter root files `AGENT.md` and `CLAUDE.md` were replaced by this `AGENTS.md` (with `CLAUDE.md` importing it). `outdated`/`diff` will report them as changed; don't restore the upstream versions.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` runs the same checks, builds with bun, then `wrangler deploy` (Workers static assets, config in `wrangler.jsonc`, worker name `tailscale-tw`). Requires repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the token is scoped to the `tailscale-tw` Worker plus Workers Routes / Zone Read on the `tailscale.tw` zone (custom domain is set in `wrangler.jsonc`).

## Conventions

- Branch off `main` and open a PR; CI must pass. Commit/PR titles for new articles use `文章：<title>`; other changes use a short 正體中文 or English summary.
- Don't remove `<AgentDirective />`, import `.mdx` directly, or hand-add components that exist in the Nimbus registry.

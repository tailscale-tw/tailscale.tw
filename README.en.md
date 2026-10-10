# Tailscale 台灣 (Tailscale Taiwan)

[正體中文](README.md) | **English** | [日本語](README.ja.md)

Source code for [tailscale.tw](https://tailscale.tw), a set of Tailscale notes and tutorials. Articles are written in Traditional Chinese (Taiwan, 台灣正體中文), covering getting started, core features, access control, PVE, Synology, performance tuning, and real-world use cases.

This is an unofficial, community-maintained site and is not affiliated with Tailscale Inc. For official documentation, see [tailscale.com/kb](https://tailscale.com/kb).

## Contents

| Category | Path | Content |
| --- | --- | --- |
| Getting started | [`/getting-started/`](https://tailscale.tw/getting-started/) | What Tailscale is, your first device, how NAT traversal works, plan comparison, CLI cheat sheet |
| Core features | [`/features/`](https://tailscale.tw/features/) | MagicDNS, Exit Node, Subnet Router, Serve, Funnel, Tailscale SSH, Taildrop, HTTPS certificates, self-hosted DERP, Peer Relay, and more |
| Performance tuning | [`/performance/`](https://tailscale.tw/performance/) | UDP GRO forwarding, BBR |
| Access control and management | [`/admin/`](https://tailscale.tw/admin/) | ACLs and grants, tags and auth keys, device security, node sharing |
| AI and agents | [`/ai/`](https://tailscale.tw/ai/) | Keeping agents inside the tailnet, always-on agent hosts, reaching Claude Code from your phone |
| PVE | [`/pve/`](https://tailscale.tw/pve/) | Running Tailscale in LXC, automatically renewing PVE certificates |
| Synology | [`/synology/`](https://tailscale.tw/synology/) | Installing Tailscale certificates on Synology |
| Platforms | [`/platforms/`](https://tailscale.tw/platforms/) | macOS installation, Codex Cloud |
| Use cases | [`/use-cases/`](https://tailscale.tw/use-cases/) | Pi-hole, NextDNS / Control D, Time Machine, internal HTTPS with Cloudflare |
| Troubleshooting | [`/troubleshooting/`](https://tailscale.tw/troubleshooting/) | FAQ, direct connections and DERP, `netcheck` and `ping` |

Entry point for AI agents: [`/llms.txt`](https://tailscale.tw/llms.txt). Every page also has a corresponding Markdown version.

## Local development

You need [Bun](https://bun.sh) (see `packageManager` in `package.json` for the version) and Node.js 22.

```sh
bun install
bun run dev        # development server
bun run build      # static build into dist/ (includes Pagefind search and OG images)
```

Before opening a PR, run the checks that CI performs:

```sh
bun run lint:text     # spacing between Chinese and English/digits (bun run fix:text to auto-fix)
bun run lint          # ESLint
bun run format:check  # Prettier (bun run format to auto-fix)
bun run typecheck     # astro check
bun run build
bun run lint:docs     # frontmatter and internal links; run after build
```

## Writing articles

Articles live in `src/content/docs/<category>/*.mdx`. The file path is the URL. For example, `pve/tailscale-on-lxc.mdx` maps to `/pve/tailscale-on-lxc/`.

- Frontmatter requires `title` (it is rendered as the H1, so do not repeat it in the body). Adding `description` is recommended. `sidebar.order` controls sorting, and `sidebar.label` sets shorter sidebar text.
- When adding an article, also add its link to the category's `index.mdx`.
- Use Traditional Chinese as used in Taiwan, with Taiwan-specific terminology. Add spaces between Chinese and English or digits.
- Start new articles with a version note, for example `> 本文以 Tailscale v1.102（2026 年 10 月）為準` (“This article is based on Tailscale v1.102 (October 2026)”).
- Internal links use root-relative paths ending with a slash, for example `[Tailscale Serve](/features/serve/)`.
- Do not change the URLs of published articles arbitrarily. If you move or rename a file, set up a redirect.

For fuller conventions (components, styling, Nimbus upgrade workflow), see [`AGENTS.md`](AGENTS.md).

## Contributing

Issues for bug reports and topic suggestions are welcome, and so are PRs. Branch off `main`, and merge once CI passes. Commit and PR titles for new articles use the format `文章：<標題>` (“Article: <title>”). Every page also has an “Edit this page” link at the bottom for editing directly on GitHub.

## Tech stack

- [Nimbus](https://nimbus-docs.com) (Astro 7 + `@cloudflare/nimbus-docs`), static output
- Layout based on the [Monospace theme](https://github.com/shyuan/astro-monospace-theme); the font is self-hosted [Sarasa Mono TC](https://github.com/be5invis/Sarasa-Gothic)
- Search powered by [Pagefind](https://pagefind.app)
- Deployed to Cloudflare Workers static assets: pushes to `main` are checked, built, and published with `wrangler deploy` by GitHub Actions

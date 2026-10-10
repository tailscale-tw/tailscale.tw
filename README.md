# Tailscale 台灣

**正體中文** | [English](README.en.md) | [日本語](README.ja.md)

[tailscale.tw](https://tailscale.tw) 的原始碼：以台灣正體中文撰寫的 Tailscale 使用筆記與教學，從入門、核心功能、存取控制，到 PVE、Synology、效能調校與實際應用情境。

本站為社群維護的非官方文件，與 Tailscale Inc. 無隸屬關係。官方文件請見 [tailscale.com/kb](https://tailscale.com/kb)。

## 內容

| 分類 | 路徑 | 內容 |
| --- | --- | --- |
| 入門 | [`/getting-started/`](https://tailscale.tw/getting-started/) | Tailscale 是什麼、第一台裝置、NAT 穿透原理、方案比較、CLI 速查 |
| 核心功能 | [`/features/`](https://tailscale.tw/features/) | MagicDNS、Exit Node、Subnet Router、Serve、Funnel、Tailscale SSH、Taildrop、HTTPS 憑證、自架 DERP、Peer Relay 等 |
| 效能調校 | [`/performance/`](https://tailscale.tw/performance/) | UDP GRO forwarding、BBR |
| 存取控制與管理 | [`/admin/`](https://tailscale.tw/admin/) | ACL 與 grants、tags 與 auth key、裝置安全、分享節點 |
| AI 與 agent | [`/ai/`](https://tailscale.tw/ai/) | 把 agent 關進 tailnet、常開的 agent 主機、從手機接回 Claude Code |
| PVE | [`/pve/`](https://tailscale.tw/pve/) | 在 LXC 中執行 Tailscale、自動更新 PVE 憑證 |
| Synology | [`/synology/`](https://tailscale.tw/synology/) | 在 Synology 上安裝 Tailscale 憑證 |
| 各平台 | [`/platforms/`](https://tailscale.tw/platforms/) | macOS 安裝、Codex Cloud |
| 應用情境 | [`/use-cases/`](https://tailscale.tw/use-cases/) | Pi-hole、NextDNS / Control D、Time Machine、搭配 Cloudflare 的內網 HTTPS |
| 疑難排解 | [`/troubleshooting/`](https://tailscale.tw/troubleshooting/) | 常見問題、直連與 DERP、`netcheck` 與 `ping` |

給 AI agent 的入口：[`/llms.txt`](https://tailscale.tw/llms.txt)，每一頁也都有對應的 Markdown 版本。

## 本機開發

需要 [Bun](https://bun.sh)（版本見 `package.json` 的 `packageManager`）與 Node.js 22。

```sh
bun install
bun run dev        # 開發伺服器
bun run build      # 靜態建置到 dist/（含 Pagefind 搜尋與 OG 圖片）
```

送出 PR 前請先跑過 CI 會檢查的項目：

```sh
bun run lint:text     # 中英文之間的空格（bun run fix:text 自動修正）
bun run lint          # ESLint
bun run format:check  # Prettier（bun run format 自動修正）
bun run typecheck     # astro check
bun run build
bun run lint:docs     # frontmatter 與站內連結，需在 build 之後執行
```

## 撰寫文章

文章放在 `src/content/docs/<分類>/*.mdx`，檔案路徑就是網址，例如 `pve/tailscale-on-lxc.mdx` 對應 `/pve/tailscale-on-lxc/`。

- frontmatter 需有 `title`（會顯示為 H1，內文不要重複），建議加上 `description`；`sidebar.order` 控制排序、`sidebar.label` 可設定較短的側欄文字。
- 新增文章時，記得把連結加進該分類的 `index.mdx`。
- 使用台灣正體中文與台灣慣用詞，中文與英文、數字之間加空格。
- 新文章開頭加上版本說明，例如 `> 本文以 Tailscale v1.102（2026 年 10 月）為準`。
- 站內連結使用根目錄相對路徑並以斜線結尾，例如 `[Tailscale Serve](/features/serve/)`。
- 已發布文章的網址請勿任意更動；若要搬移或改名，需另外設定轉址。

更完整的慣例（元件、樣式、Nimbus 升級流程）寫在 [`AGENTS.md`](AGENTS.md)。

## 貢獻

歡迎開 issue 回報錯誤或提出主題建議，也歡迎直接送 PR。請從 `main` 開分支，CI 通過後再合併。新文章的 commit 與 PR 標題使用 `文章：<標題>` 的格式。每一頁底部也有「Edit this page」連結，可以直接在 GitHub 上修改。

## 技術架構

- [Nimbus](https://nimbus-docs.com)（Astro 7 + `@cloudflare/nimbus-docs`），靜態輸出
- 版面參考 [Monospace theme](https://github.com/shyuan/astro-monospace-theme)，字型為自架的[更紗黑體 Mono TC](https://github.com/be5invis/Sarasa-Gothic)
- 搜尋使用 [Pagefind](https://pagefind.app)
- 部署在 Cloudflare Workers static assets：推送到 `main` 後由 GitHub Actions 檢查、建置並以 `wrangler deploy` 發布

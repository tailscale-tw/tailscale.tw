# Tailscale 台灣（Tailscale Taiwan）

[正體中文](README.md) | [English](README.en.md) | **日本語**

[tailscale.tw](https://tailscale.tw) のソースコードです。Tailscale の使い方のメモとチュートリアルを、入門、コア機能、アクセス制御、PVE、Synology、パフォーマンスチューニング、実際の活用シナリオまで幅広くまとめています。

なお、本サイトの記事は台灣正體中文（台湾で使われる繁体字中国語）で書かれています。記事本文は日本語ではありませんのでご注意ください。この README は日本語の読者向けの案内です。

本サイトはコミュニティが運営する非公式のドキュメントで、Tailscale Inc. とは関係ありません。公式ドキュメントは [tailscale.com/kb](https://tailscale.com/kb) をご覧ください。

## コンテンツ

| カテゴリ | パス | 内容 |
| --- | --- | --- |
| はじめに | [`/getting-started/`](https://tailscale.tw/getting-started/) | Tailscale とは、最初のデバイス、NAT 越えの仕組み、プラン比較、CLI クイックリファレンス |
| コア機能 | [`/features/`](https://tailscale.tw/features/) | MagicDNS、Exit Node、Subnet Router、Serve、Funnel、Tailscale SSH、Taildrop、HTTPS 証明書、セルフホスト DERP、Peer Relay など |
| パフォーマンスチューニング | [`/performance/`](https://tailscale.tw/performance/) | UDP GRO forwarding、BBR |
| アクセス制御と管理 | [`/admin/`](https://tailscale.tw/admin/) | ACL と grants、tags と auth key、デバイスのセキュリティ、ノードの共有 |
| AI と agent | [`/ai/`](https://tailscale.tw/ai/) | agent を tailnet に閉じ込める、常時稼働の agent ホスト、スマートフォンから Claude Code に接続する |
| PVE | [`/pve/`](https://tailscale.tw/pve/) | LXC で Tailscale を実行する、PVE 証明書の自動更新 |
| Synology | [`/synology/`](https://tailscale.tw/synology/) | Synology に Tailscale 証明書をインストールする |
| 各プラットフォーム | [`/platforms/`](https://tailscale.tw/platforms/) | macOS へのインストール、Codex Cloud |
| 活用シナリオ | [`/use-cases/`](https://tailscale.tw/use-cases/) | Pi-hole、NextDNS / Control D、Time Machine、Cloudflare と組み合わせた内部ネットワークの HTTPS |
| トラブルシューティング | [`/troubleshooting/`](https://tailscale.tw/troubleshooting/) | よくある問題、直接接続と DERP、`netcheck` と `ping` |

AI agent 向けの入口は [`/llms.txt`](https://tailscale.tw/llms.txt) です。すべてのページに対応する Markdown 版もあります。

## ローカルでの開発

[Bun](https://bun.sh)（バージョンは `package.json` の `packageManager` を参照）と Node.js 22 が必要です。

```sh
bun install
bun run dev        # 開発サーバー
bun run build      # dist/ に静的ビルド（Pagefind 検索と OG 画像を含む）
```

PR を送る前に、CI がチェックする項目を実行してください。

```sh
bun run lint:text     # 中国語と英数字の間のスペース（bun run fix:text で自動修正）
bun run lint          # ESLint
bun run format:check  # Prettier（bun run format で自動修正）
bun run typecheck     # astro check
bun run build
bun run lint:docs     # frontmatter とサイト内リンク（build の後に実行が必要）
```

## 記事の執筆

記事は `src/content/docs/<カテゴリ>/*.mdx` に置きます。ファイルパスがそのまま URL になります。たとえば `pve/tailscale-on-lxc.mdx` は `/pve/tailscale-on-lxc/` に対応します。

- frontmatter には `title` が必要です（H1 として表示されるため、本文では繰り返さないでください）。`description` も付けることをおすすめします。`sidebar.order` で並び順を、`sidebar.label` でサイドバーに表示する短いテキストを指定できます。
- 記事を追加したときは、該当カテゴリの `index.mdx` にもリンクを追加してください。
- 台灣正體中文と台湾で一般的な用語で書き、中国語と英語・数字の間にはスペースを入れます。
- 新しい記事の冒頭にはバージョンの注記を付けます。例：`> 本文以 Tailscale v1.102（2026 年 10 月）為準`
- サイト内リンクはルート相対パスで、末尾にスラッシュを付けます。例：`[Tailscale Serve](/features/serve/)`
- 公開済みの記事の URL は、むやみに変更しないでください。移動や名前の変更が必要な場合は、別途リダイレクトを設定します。

コンポーネント、スタイル、Nimbus のアップグレード手順など、より詳しい規約は [`AGENTS.md`](AGENTS.md) に記載しています。

## コントリビューション

誤りの報告やトピックの提案は issue で歓迎しています。PR を直接送っていただくことも可能です。`main` からブランチを作成し、CI が通ってからマージしてください。新しい記事の commit と PR のタイトルは `文章：<標題>` の形式にします。各ページの下部には「Edit this page」リンクもあり、GitHub 上で直接編集できます。

## 技術構成

- [Nimbus](https://nimbus-docs.com)（Astro 7 + `@cloudflare/nimbus-docs`）、静的出力
- レイアウトは [Monospace theme](https://github.com/shyuan/astro-monospace-theme) を参考にし、フォントはセルフホストの [Sarasa Mono TC](https://github.com/be5invis/Sarasa-Gothic)
- 検索には [Pagefind](https://pagefind.app) を使用
- Cloudflare Workers static assets にデプロイ：`main` にプッシュすると GitHub Actions がチェックとビルドを行い、`wrangler deploy` で公開します

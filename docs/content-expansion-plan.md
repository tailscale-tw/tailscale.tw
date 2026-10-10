# tailscale.tw 內容擴展計劃（2026 年 10 月）

> 本文件是 tailscale.tw 後續文章的規劃書，不是站上的文章。依 2026 年 10 月的 Tailscale 官方動態（客戶端 v1.104）、AI agent 社群用法與 homelab 社群的常見情境整理而成。寫作時以 `AGENTS.md` 的規範為準。

## 摘要

- **站內現況**：9 個 section、35 篇文章（不含 section 首頁）。入門、核心功能、存取控制、疑難排解已經成形；AI／agent 只有一篇（Codex Cloud），homelab 應用只有 4 篇，台灣在地的網路環境（中華電信、社區網路、華碩路由器、群暉／威聯通）幾乎沒有專文。
- **外部趨勢**：2026 年 Tailscale 官方把重心放在 AI（Aperture GA、tsidp、Tailscale skill、Codex Cloud、Meta Muse），社群最熱的用法是「家裡一台常開的主機跑 agent，出門用手機接回去」。homelab 圈的經典情境（Home Assistant、Jellyfin／Immich、遊戲串流、旅行路由器、異地備份）則多年不變，但繁中教學大多停在「安裝與登入」。
- **建議**：新增 `ai/` section 作為擴展主軸（12 篇），同時補齊台灣在地情境（6 篇）、homelab 應用（約 20 篇）與平台安裝（約 12 篇）。第一階段（三個月）先做 15 篇 P0。
- **既有文章要更新**：方案與限制比較（2026 年 4 月 Pricing v4）、NextDNS／Control D（Tailscale 於 2026 年 8 月推出 Control D 付費 DNS 過濾）、效能調校（2026 年 9 月「making Tailscale faster」）。

## 1. 研究方法與限制

- 以網頁搜尋彙整 Tailscale 官方部落格、文件、GitHub，以及第三方教學、論壇與 YouTube 索引。
- **本次作業環境無法直接開啟 tailscale.com 與 youtube.com**（被網路 proxy 擋下），官方頁面與影片的內容來自搜尋引擎的摘要與第三方轉載。計劃中列出的影片標題與 ID 在動筆前要人工到 YouTube 核對，官方功能細節也要以當時的文件為準。
- 搜尋以英文為主，另以繁體中文、簡體中文、日文各做了數次，用來判斷繁中圈已經有什麼。
- 沒有對 PTT、Mobile01、Dcard 做站內搜尋（搜尋引擎未收錄相關討論串）。要知道台灣使用者實際卡在哪裡，建議另外用「Tailscale 中華電信」、「Tailscale 社區網路」、「Tailscale DS」等關鍵字到這些論壇翻一輪。

## 2. 站內現況盤點

| Section           | 篇數 | 已涵蓋                                                                                                          | 明顯缺口                                                                        |
| ----------------- | ---- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `getting-started` | 5    | 概念、NAT 穿透、第一台裝置、方案比較、CLI 速查                                                                  | 台灣 ISP／NAT 環境、Pricing v4 更新                                             |
| `features`        | 12   | Serve、Funnel、Subnet Router、Exit Node、Taildrop、Tailcat、SSH、憑證、Mullvad、MagicDNS、Peer Relay、自架 DERP | Tailscale Services、App connectors、Serve 身分標頭、Taildrive、SSH 工作階段錄影 |
| `performance`     | 2    | UDP GRO、BBR                                                                                                    | 2026 年 multi-queue／netmap caching、iperf 量測方法                             |
| `admin`           | 4    | ACL／grants、tags／auth key、裝置安全、分享                                                                     | OAuth client、GitOps、device posture                                            |
| `pve`             | 2    | 憑證自動更新、LXC                                                                                               | Proxmox Backup Server 異地備份                                                  |
| `synology`        | 1    | 憑證安裝                                                                                                        | DSM 7 outbound／TUN、Container Manager、QuickConnect 比較、Hyper Backup         |
| `platforms`       | 2    | macOS 安裝、Codex Cloud                                                                                         | Docker、Kubernetes、路由器（華碩、OpenWrt、GL.iNet、OPNsense）、QNAP、手機      |
| `use-cases`       | 4    | 內網 HTTPS、Time Machine、NextDNS／Control D、Pi-hole                                                           | 幾乎所有 homelab 經典情境                                                       |
| `troubleshooting` | 3    | netcheck／ping、直連與 DERP、常見問題                                                                           | 台灣 ISP 專文、中國出差                                                         |

值得保留的做法：每篇都有版本註記、官方與社群說法衝突時並陳（如 Codex Cloud 文的 MagicDNS 段落）、以 grants 範例收尾。新文章延續這個格調。

## 3. 外部觀察

### 3.1 Tailscale 官方 2025–2026 動態

AI 相關：

- **Aperture by Tailscale**：AI gateway。2026 年 1 月 alpha、4 月 beta、8 月 26 日 GA。GA 文章明說要「回到 Tailscale 的根源」，提供個人與 homelab 玩家「it just works」的體驗；新功能包括在 Aperture 內直接購買各家模型的 token、tailnet 與裝置的 MCP 控制、聊天介面與 agent sandbox。另有 **Aperture CLI**（alpha，2026 年 5 月）：在 tailnet 內自動找到 Aperture 與可用模型，再配對本機安裝的 coding agent（Claude Code、Gemini CLI、Codex、Copilot、OpenCode、Claude Cowork），bridge mode 讓不能裝 Tailscale 的機器也能用。
- **tsidp**：tailnet 內的 OIDC／OAuth 身分提供者（實驗性），支援 MCP Authorization 規格要求的端點，包括 Dynamic Client Registration。官方部落格以此主張企業 IdP 不好接 MCP 時可用 tsidp 當橋。
- **Tailscale skill for coding agents**（public alpha，`github.com/tailscale/tailscale-skill`）：依 Agent Skills 標準，`npx skills add` 安裝，支援 Claude Code、Codex、Cursor、OpenCode、Pi。涵蓋連線功能、診斷、容器與 Kubernetes、CLI、API、tsnet。官方聲明不提供支援。
- **Codex Cloud**（2026 年 10 月 6 日部落格）：站上已有文章。
- **Meta Muse**（2026 年 9 月 30 日部落格）：Muse 預設整合 Tailscale；文中同時點名 OpenClaw 內建整合與 Pi 的社群套件。
- 「A no-nonsense explainer to Agentic AI」（6 月）、「lethal trifecta」（8 月）：官方對 agent 安全的論述，適合當觀念文的骨架。
- 「Secure AI agent connectivity」use case 頁：每個 agent 有網路身分、以單一 policy 控制存取。

平台相關：

- **Winter Update Week（2026 年 2 月）**：Tailscale Services、Peer Relays、workload identity federation 轉 GA；macOS 1.96.2 起有視窗介面。
- **Pricing v4（2026 年 4 月 8 日）**：Personal Plus 退場，免費 Personal 方案提高到 6 位使用者、裝置數不限；Starter 改名 Standard、每人每月 8 美元；Premium 18 美元；計費從 MAU 改為 seat。站上的方案比較文需要更新。
- **DNS filtering by Control D（2026 年 8 月 28 日）**：透過 Tailscale 銷售的付費 DNS 過濾，規則在 Control D 設定、依 group／tag／裝置屬性套用。站上的 NextDNS／Control D 文要補一段。
- **Tailscale PAM beta（2026 年 8 月 27 日）**：原 Border0，企業導向。
- **「We're making Tailscale faster」（2026 年 9 月 22 日）**：小封包共用 64 KiB 緩衝區（Linux／Android 約 5% 提速）、subnet router／exit node／app connector 的 multi-queue（2026 下半年）、netmap caching 加速啟動。預計 v1.104 起陸續落地。效能調校 section 可以接著寫。
- **Tailscale SSH session recording**（beta，tsrecorder）與 admin console 的瀏覽器 SSH。
- **Taildrive** 仍為 alpha（文件 2026 年 1 月驗證）。
- **GitHub Action**（`tailscale/github-action`）：OAuth client 建立 ephemeral、tagged 節點，也支援 workload identity federation。

### 3.2 AI／agent 社群用法

搜尋到的英文與日文文章在 2026 年大量出現，共通模式如下：

1. **家裡一台常開主機當 agent 主機**。Mac mini 最常見（省電、安靜、Apple Silicon 可跑本地模型），也有人用 5 美元 VPS。設定要點：關閉睡眠（`pmset`）、開 Remote Login、Tailscale、只用金鑰登入 SSH、專用的非管理員帳號、LaunchDaemon 自動重啟。FileVault 與 HDMI dummy plug 各家說法相反，寫作時要實測。
2. **從手機接回 Claude Code**。DIY 路線是 Tailscale + SSH + tmux（或 mosh、dtach）+ Termius／Blink；官方路線是 Anthropic 的 Remote Control（經 Anthropic relay 的 HTTPS polling，session URL 等於 bearer token）。兩條路線的取捨、推播通知（hook）、mosh 不轉送 SSH agent 等細節都有人寫，但繁中沒有。
3. **OpenClaw／Hermes Agent 個人助理**。OpenClaw 內建 `gateway.tailscale.mode: serve | funnel`，gateway 綁 loopback、Funnel 強制 password auth、以 `tailscale whois` 驗證身分標頭。2026 年初 OpenClaw 有大量實例暴露在公網（各來源 42,000 到 135,000 不等，CVE-2026-25253 零點擊 RCE），是最好的反面教材。Hermes 的 Telegram gateway 走 outbound polling，預設只開 SSH，dashboard 9119／API 8642 需手動開。
4. **本地 LLM 遠端使用**。Ollama 預設只聽 localhost；多數教學叫人改 `OLLAMA_HOST=0.0.0.0`，較好的做法是綁 Tailscale IP 或用 Serve。SentinelOne 與 Censys 在 2026 年初掃到 175,000 台無驗證的 Ollama 暴露在公網。Open WebUI 官方文件有 Tailscale 專頁：`tailscale serve https / http://localhost:8080`，並能讀 `Tailscale-User-Login` 標頭做 SSO。
5. **MCP server 放在 tailnet**。社群 MCP server 的 README 多建議「HTTP 模式 + Serve，不要 Funnel」。tsidp 可當 MCP 的 authorization server。
6. **雲端 sandbox 連回 tailnet**。Codex Cloud 是唯一官方支援的；Claude Code on the web 有社群用 SessionStart hook 加入 tailnet 的做法（非官方，且曾因 session ID 含底線不符 DNS 主機名稱規則而失敗）；Tembo 有 Tailscale 整合；E2B／Modal／Daytona／Cloudflare Sandbox 的比較文都沒提 Tailscale。GitHub Actions 的做法最成熟。
7. **NVIDIA DGX Spark**。NVIDIA 官方 playbook 有「Set up Tailscale on Your Spark」；台灣精技電腦也寫了繁中版。華碩 Ascent GX10 等同款機器在台灣有售。

### 3.3 Homelab 社群與 YouTube

官方頻道（@Tailscale）：「How to get started with Tailscale in under 10 minutes」（`sPdvyR7bLqI`，約 56 萬次觀看）、「Tailscale Explained」系列（Exit Nodes、Subnet Routers、Serve and Funnel、Tailscale SSH）、「Tailscale ACLs Explained」、SSH session recording demo、TailscaleUp 2026 場次（「Everything Tailscale at GitHub」`boiZz8KSGWc`、「Painless Private Infrastructure Integrations with Tailscale and tsnet」）。

搜尋到的 homelab 創作者影片（需核對）：

| 影片                                                                                    | 頻道／來源                                         | 重點                                                    |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| My Private Mini Kubernetes Cluster - Powered By Tailscale（2025-11-07）                 | Techno Tim（Tailscale 贊助）                       | 行動 k8s 叢集走 5G + Tailscale                          |
| Tailscale on pfSense／TrueNAS／Headscale／Mullvad 系列                                  | Lawrence Systems                                   | 防火牆與 NAS 整合                                       |
| How to Use Tailscale: Step-by-Step Setup Guide for Beginners                            | LearnLinuxTV（Jay）                                | 入門；The Homelab Show ep. 64 談 Tailscale 與 Headscale |
| I Went to TailscaleUp 2026! Here's What Happened（`GaR0HdXnABc`）                       | 未確認                                             | 2026 大會觀察                                           |
| How to Secure Your Homelab with Tailscale + Nginx Proxy Manager (2026)（`NsnXIE2pT9Y`） | 未確認                                             | NPM + Tailscale 自訂網域                                |
| NetBird vs Tailscale: The One I'd Trust With My #homelab（`jnGsStleHd0`）               | 未確認（2026-01）                                  | 競品比較                                                |
| Access Your Homelab From Anywhere With Tailscale（`CELHKS4ukpw`）                       | 未確認                                             | 遠端存取、異地備份、split DNS                           |
| Proxmox VE + Tailscale Setup Guide（`0AgFXMNHgaY`）                                     | Miles Matias                                       | 直接裝在 PVE host                                       |
| Dump the Cloud and Build Your Own Homelab Server for $1000（`Tquyga4fkCY`）             | 未確認（2026-10）                                  | 自架取代雲端，提到 Tailscale                            |
| Build a Tailscale Exit Node in 1 Minute with Flatcar Linux（`z-m9Yeihk-U`）             | 未確認                                             | 極簡 exit node                                          |
| Talk Python #546: Self hosting apps for Python people（2026-04-27）                     | Podcast，來賓 Alex Kretzschmar（Tailscale DevRel） | Immich、Home Assistant、不開埠                          |

NetworkChuck、Christian Lempa、Jim's Garage、Wolfgang's Channel、Hardware Haven、Raid Owl、DB Tech、Jeff Geerling 這幾個頻道用搜尋引擎都找不到 Tailscale 專題影片，要人工到 YouTube 確認後再決定是否引用。

社群文章裡反覆出現的情境（依出現頻率）：

1. 不開埠連回家中服務（Jellyfin、Plex、Immich、Nextcloud、Vaultwarden、Home Assistant）。
2. Exit node：公共 Wi-Fi 保護、Apple TV 當 exit node、旅行路由器（GL.iNet）把整個旅館房間接回家。
3. Subnet router：Raspberry Pi 讓印表機、IP cam、IoT 這些裝不了 Tailscale 的裝置可達；pfSense／OPNsense／UniFi 當 site-to-site。
4. Docker sidecar（`network_mode: service:tailscale`）+ Serve，ScaleTail 專案把 Jellyfin、Immich 等打包成現成 compose。
5. Kubernetes operator：`ingressClassName: tailscale`、Connector 當 subnet router／exit node。
6. 遊戲：Minecraft／Palworld 私服分享給朋友（node sharing）、Moonlight／Sunshine 串流到 Steam Deck 或掌機。
7. 遠端桌面：RustDesk 直連、Windows RDP、Wake-on-LAN（官方 2025 年 8 月部落格以 UpSnap 示範）。
8. 異地備份 3-2-1：Proxmox Backup Server、restic、borg 到朋友家的 NAS，用 ACL 只開備份埠。
9. 開發：Funnel 接 Twilio／GitHub webhook、Serve 把 dev server 分享給同事。
10. Tailscale vs Cloudflare Tunnel vs 傳統 VPN 的選擇。
11. 3D 列印（Klipper／Mainsail／OctoPrint，Mainsail 官方文件明說別開埠、推薦 Tailscale）。
12. Headscale 自架控制平面（v0.29，2026 年 6 月）。

### 3.4 台灣在地脈絡

- **CGNAT**：TWNIC 的調查顯示部分業者（含中華電信）CGNAT 配發比例為 1:16。HiNet 非固定制用戶可免費申請 1 個固定 IP，光世代固定制有 IPv6 雙協定。這直接影響「能不能直連」，但目前沒有任何繁中文章把 ISP 方案與 `tailscale netcheck` 的結果對起來講。
- **社區網路**：很多大樓社區光纖共用對外 IP、無法 port forward。香腸炒魷魚 2023 年就以此為題寫過 Tailscale，證明這是台灣讀者的真實痛點。
- **路由器**：華碩是台灣市佔最高的家用路由器品牌。原廠韌體裝不了 Tailscale，要刷 Asuswrt-Merlin 3006 以上 + Entware，Entware 的版本常過舊，有人改用 GitHub 自製包。snbforums 有完整教學，繁中沒有。
- **NAS**：群暉與威聯通在台灣的普及率高。QuickConnect 在 NAT 下常退回中繼且只能連群暉自家 App；QNAP 社群有人指出 myQNAPcloud 要經過台灣的 QNAP 伺服器、Tailscale 較快。
- **AI 硬體**：DGX Spark／華碩 Ascent GX10 在台灣上市，精技電腦已經寫了 Tailscale 連線教學。
- **既有繁中內容**：軟體玩家（2026 完整教學）、Ivon 的部落格、香腸炒魷魚、most.tw（2026 完整指南）、alphalab.site（AI agent 機隊）、CyberQ（QNAP 跨國協作）、Barry 部落格（Exit Node 看台灣影片）。多數是「安裝、登入、四大功能」的單篇長文，深入到 ACL、Serve、Docker、路由器、agent 安全的幾乎沒有。這是 tailscale.tw 的差異化空間。
- **海外台灣人**：用家裡的 exit node 看台灣限定串流、用台灣網銀；反過來在台灣用東京 VPS 的 exit node。串流平台會擋機房 IP，寫作時要實測並保守陳述。
- **中國出差**：搜尋到的第三方文章把問題分成控制平面登入、直連、DERP 三層，並建議出差前先測。官方沒有聲明。可以寫，但只談「連回家裡與公司」的技術現象，語氣保守。

## 4. 擴展計劃

### 4.1 結構調整

1. **新增 `ai/` section**（`sidebar.group.label: AI 與 agent`，建議 `sidebar.order: 0.9`，排在存取控制之後、PVE 之前；若希望放在應用情境旁邊則用 5.5）。這是後續一年最有流量潛力的主題，值得獨立成區。
2. `platforms/codex-cloud` 保留原 URL（不改檔名），在 `ai/index` 與相關文章交叉連結。
3. `synology/` 與 `pve/` 維持，但各自補 2 到 3 篇。
4. 首頁 `index.mdx` 加入 `ai/` 區塊；每個 section 的 `index.mdx` 手動加上新文章連結。
5. 考慮在首頁或 `use-cases/index` 加一段「依你的情境找文章」導覽（在外面接回家 → Serve／Exit Node；讓朋友用 → Sharing／Funnel；跑 agent → ai/），降低新讀者的選擇成本。

### 4.2 文章清單

優先順序：P0 = 第一階段（三個月內）、P1 = 第二階段、P2 = 有餘裕再做。「驗證」欄標示寫作前需要的實機驗證；每篇都要依規範加上版本註記（例如「本文以 Tailscale v1.104（2026 年 10 月）為準」）。

#### A. AI 與 agent（新 section `ai/`）

| #   | Slug                        | 標題（草案）                                                                   | 優先 | 內容重點                                                                                                                                                                                                                                     | 驗證                                    |
| --- | --------------------------- | ------------------------------------------------------------------------------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| A1  | `ai/index`                  | AI 與 agent：為什麼要把 agent 關進 tailnet                                     | P0   | section 首頁兼觀念文。lethal trifecta（私密資料、不可信內容、對外通訊）、agent 需要的「無聊基礎建設」、三原則：tag 身分、grants 最小權限、ephemeral 節點。串起站內 Codex Cloud、tags／auth key、grants 三篇。                                | 文件整理                                |
| A2  | `ai/always-on-agent-host`   | 家裡一台常開主機跑 agent：Mac mini 的無頭設定                                  | P0   | `pmset` 不休眠、Remote Login、Tailscale（Homebrew 版 vs App Store 版的沙盒差異）、SSH 只用金鑰、agent 專用非管理員帳號、LaunchDaemon 自動重啟、FileVault 與自動登入的取捨、HDMI dummy plug 是否還需要。附 Linux 小主機與 VPS 的對照。        | 實機（macOS）                           |
| A3  | `ai/claude-code-from-phone` | 從手機接回家裡的 Claude Code：Tailscale + SSH + tmux，與 Remote Control 的比較 | P0   | Termius／Blink 連線、tmux／mosh 保持工作階段、mosh 不轉送 SSH agent 的 git 問題、hook 推播通知；對比 Anthropic Remote Control（HTTPS relay、session URL 即 bearer token、單一工作階段限制）。何時選哪個。                                    | 實機（iOS + macOS）                     |
| A4  | `ai/openclaw-hermes`        | OpenClaw／Hermes Agent 個人助理只開給自己：Serve 模式與身分驗證                | P0   | gateway 綁 loopback、`gateway.tailscale.mode: serve`、何時才該用 Funnel（強制 password auth）、`tailscale whois` 驗證 `Tailscale-User-Login`；2026 年初 OpenClaw 公網暴露事件與 CVE-2026-25253 當反面教材；Hermes 的 outbound polling 預設。 | 實機（其中一套）                        |
| A5  | `ai/local-llm-remote`       | 在外面用家裡的 Ollama／LM Studio／Open WebUI                                   | P0   | `OLLAMA_HOST` 綁 Tailscale IP 而不是 `0.0.0.0`、Serve 給 HTTPS、Open WebUI 的 Tailscale SSO（身分標頭）、手機 App 設定、關 Wi-Fi 用行動網路測試；SentinelOne／Censys 的 175,000 台暴露 Ollama 警示。                                         | 實機                                    |
| A6  | `ai/mcp-over-tailscale`     | 把 MCP server 放在 tailnet：Serve、bearer token 與 tsidp                       | P1   | streamable HTTP MCP 以 Serve 發布、Claude Desktop／Claude Code 的遠端 MCP 設定、為什麼不要 Funnel、tsidp 當 OAuth authorization server（DCR）的實驗性做法與風險。                                                                            | 實機 + tsidp 需標註實驗性               |
| A7  | `ai/tailscale-skill`        | 讓 coding agent 懂 Tailscale：官方 skill 與社群 skill                          | P1   | `npx skills add https://github.com/tailscale/tailscale-skill`、支援的 agent、涵蓋範圍、官方不支援的聲明；社群 tailscale-superpowers 與 API skill；用 skill 讓 agent 幫你寫 grants 的示範與審核提醒。                                         | 實機（Claude Code）                     |
| A8  | `ai/cloud-sandbox-pattern`  | 雲端 agent sandbox 連回 tailnet 的通用做法                                     | P1   | 從 Codex Cloud 一文抽出通則：reusable + ephemeral + tagged auth key、OAuth client、pre-approved、grants 只開 HTTPS；Claude Code on the web 的社群 hook 做法（非官方）；Tembo 整合；E2B／Modal／Daytona 目前沒有原生支援。                    | 文件整理 + 實機（至少一種）             |
| A9  | `ai/aperture`               | Aperture 是什麼：給個人與 homelab 的 AI gateway，還是企業工具？                | P1   | 2026 年 GA 的定位、token 購買、MCP 控制、Aperture CLI 的 bridge mode、個人方案能不能用與費用；與自架 LiteLLM 之類的比較。                                                                                                                    | 實機（Aperture 個人帳號）               |
| A10 | `ai/dgx-spark`              | DGX Spark／華碩 Ascent GX10 用 Tailscale 遠端存取                              | P1   | 依 NVIDIA playbook 改寫為繁中，加上 Tailscale SSH、Serve 發布 Jupyter／Open WebUI、tag 與 grants。                                                                                                                                           | 無機器則標註「依 NVIDIA playbook 整理」 |
| A11 | `ai/github-actions`         | GitHub Actions 進 tailnet：用 OAuth client 建 ephemeral runner                 | P1   | `tailscale/github-action`、OAuth client 與 tag、workload identity federation、self-hosted runner 的差異、不要用示範的全開 grants。                                                                                                           | 實機                                    |
| A12 | `ai/n8n-dify-private`       | n8n／Dify 自動化流程只留在 tailnet                                             | P2   | Serve 發布、webhook 要收外部事件時改 Funnel 的取捨、憑證。                                                                                                                                                                                   | 實機                                    |

#### B. 核心功能補完（`features/`）

| #   | Slug                              | 標題（草案）                                         | 優先 | 內容重點                                                                                                                                                                                   | 驗證 |
| --- | --------------------------------- | ---------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| B1  | `features/serve-identity-headers` | Serve 的身分標頭：讓自架服務直接認得 tailnet 使用者  | P0   | `Tailscale-User-Login`／`-Name`／`-Profile-Pic`、Serve 會剝除客戶端偽造的標頭、tagged 裝置不帶、分享裝置的外部使用者會帶、服務只聽 localhost；Grafana auth proxy、Open WebUI、Dashy 範例。 | 實機 |
| B2  | `features/tailscale-services`     | Tailscale Services：一個名稱、一個 TailVIP、多台後端 | P1   | 2026 年 2 月 GA。MagicDNS 名稱 + TailVIP、多主機容錯、只支援 TCP、後端必須是 tag 身分；與 Serve、subnet router 的差異。                                                                    | 實機 |
| B3  | `features/app-connectors`         | App connectors：以網域而不是 IP 做路由               | P2   | SaaS IP allowlist 情境、家用情境有限（家中動態 IP）、Linux 端要 `--accept-routes`、設定繁瑣的提醒。                                                                                        | 實機 |
| B4  | `features/taildrive`              | Taildrive（alpha）：直接掛載 tailnet 上的資料夾      | P2   | 各平台狀態、iOS 只能讀、policy 寫法；與 Taildrop、SMB over Tailscale 的比較。                                                                                                              | 實機 |
| B5  | `features/ssh-session-recording`  | Tailscale SSH 工作階段錄影與瀏覽器 SSH               | P2   | tsrecorder 自架、asciinema 格式、只錄輸出不錄按鍵、個人方案可用性；admin console 的 SSH 按鈕。                                                                                             | 實機 |

#### C. 應用情境（`use-cases/`）

| #   | Slug                                   | 標題（草案）                                                        | 優先 | 內容重點                                                                                                                                                                                                                                                      | 驗證           |
| --- | -------------------------------------- | ------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| C1  | `use-cases/home-assistant`             | Home Assistant 不開埠遠端存取：官方 add-on、Serve 與 Funnel         | P0   | add-on 安裝、2026 年 8 月 HA 改版後 proxy 設定移到 Settings > System > Network、`trusted_proxies` 要含 `100.64.0.0/10`、key expiry 導致一天後斷線、Funnel 只給裝不了 Tailscale 的裝置。                                                                       | 實機           |
| C2  | `use-cases/choosing-remote-access`     | Tailscale、Cloudflare Tunnel、QuickConnect、傳統 VPN 怎麼選         | P0   | 私有網路 vs 公開發布的本質差異、誰要用（自己、家人、朋友、陌生人）、費用與隱私、可以並存。                                                                                                                                                                    | 文件整理       |
| C3  | `use-cases/apple-tv-exit-node`         | 一台 Apple TV 就是家裡的 exit node                                  | P0   | tvOS App 安裝、Run as Exit Node、admin console 核准、常開且有線的優勢、無法當 subnet router 的限制。                                                                                                                                                          | 實機           |
| C4  | `use-cases/subnet-router-raspberry-pi` | Raspberry Pi 當 subnet router 兼 exit node 的實作                   | P0   | 觀念與 `--advertise-routes`、SNAT 已在 `features/subnet-router` 講完，本篇只做 Pi 的實作：Pi OS 安裝與開機自啟、IP forwarding、核准路由、同一台兼 exit node 的取捨（關 SNAT 與 exit node 衝突）、當 Wake-on-LAN 發送端；為後面的 WoL、監視器、3D 列印文打底。 | 實機（Pi）     |
| C5  | `use-cases/docker-sidecar`             | Docker 的 Tailscale sidecar：Jellyfin、Immich、Vaultwarden 共用寫法 | P0   | `network_mode: service:tailscale`、`TS_AUTHKEY`／`TS_STATE_DIR`／`TS_SERVE_CONFIG`、healthcheck 順序、只讓需要對外的容器進 tailnet；ScaleTail 範例。                                                                                                          | 實機           |
| C6  | `use-cases/immich-mobile-backup`       | 手機照片用 Immich 經 Tailscale 自動備份回家                         | P1   | App 伺服器網址填 MagicDNS 名稱、關掉「只在 Wi-Fi 上傳」、Android 電池最佳化、iPhone 背景限制。                                                                                                                                                                | 實機           |
| C7  | `use-cases/vaultwarden`                | Vaultwarden 只用 Tailscale Serve（不需要反向代理）                  | P1   | 瀏覽器要 secure context 所以一定要 HTTPS、`tailscale serve --https`、手機 App 設定。                                                                                                                                                                          | 實機           |
| C8  | `use-cases/game-server-with-friends`   | 跟朋友開 Minecraft／Palworld 私服：node sharing                     | P1   | 分享單一節點而非整個 tailnet、防火牆只在 `tailscale0` 開遊戲埠、Tailscale auth plugin 的限制（Bedrock、皮膚）、LAN 瀏覽器看不到要直接輸入 IP。                                                                                                                | 實機           |
| C9  | `use-cases/moonlight-sunshine`         | Moonlight／Sunshine 遊戲串流走 Tailscale                            | P1   | 直連與 DERP 對延遲的影響（連到 direct-vs-derp 文）、1080p60 與 20–40 Mbps 的起點、Steam Deck／掌機客戶端。                                                                                                                                                    | 實機           |
| C10 | `use-cases/remote-desktop`             | RustDesk、RDP、VNC 走 Tailscale                                     | P1   | RustDesk 直連 IP 模式不需要自架 relay、Windows RDP、macOS 螢幕共享；給長輩遠端支援時搭配 sharing。                                                                                                                                                            | 實機           |
| C11 | `use-cases/wake-on-lan`                | 出門在外喚醒家裡的電腦：Wake-on-LAN 與 Tailscale                    | P1   | WoL 是二層廣播所以需要同網段的常開小裝置、`etherwake`、UpSnap 之類的 Web 介面、BIOS 設定、常見失敗（封包只到 `tailscale0`）。                                                                                                                                 | 實機           |
| C12 | `use-cases/offsite-backup`             | 異地備份放朋友家：PBS、restic 與 Hyper Backup 走 Tailscale          | P1   | 3-2-1、對方只開備份埠的 ACL、append-only 防勒索、PBS 遠端 datastore、群暉 Hyper Backup 到另一台群暉。                                                                                                                                                         | 實機           |
| C13 | `use-cases/custom-domain-proxy`        | 自訂網域 + Nginx Proxy Manager／Caddy + Tailscale                   | P1   | split DNS 指到內網反向代理、DNS challenge 憑證、與站內「內網 HTTPS」文的關係。                                                                                                                                                                                | 實機           |
| C14 | `use-cases/webhook-dev`                | 開發時用 Funnel 接 webhook、用 Serve 分享 dev server                | P1   | Twilio／GitHub webhook、固定網址可多人共用、Serve 給同事 vs Funnel 給外部服務。                                                                                                                                                                               | 實機           |
| C15 | `use-cases/streaming-abroad`           | 人在海外用家裡的 exit node：台灣限定串流與網銀                      | P1   | exit node 選擇、DNS 也要走家裡、平台封鎖的保守說明；反向情境（東京 VPS）實測。                                                                                                                                                                                | 實機；用語保守 |
| C16 | `use-cases/3d-printer`                 | Klipper／Mainsail／OctoPrint 遠端監看                               | P2   | Mainsail 官方不建議開埠、`trusted_clients`／CORS 加 `100.64.0.0/10`、攝影機串流。                                                                                                                                                                             | 實機           |
| C17 | `use-cases/frigate-cameras`            | Frigate NVR 與 IP cam：透過 subnet router 看家                      | P2   | 攝影機不裝 Tailscale、Frigate 走 Serve、頻寬考量。                                                                                                                                                                                                            | 實機           |
| C18 | `use-cases/syncthing`                  | Syncthing 只走 tailnet                                              | P2   | 關閉 global discovery 與 relay、只用 Tailscale IP。                                                                                                                                                                                                           | 實機           |
| C19 | `use-cases/family-tech-support`        | 幫家人長輩做遠端技術支援                                            | P2   | sharing + RustDesk、對方不用懂 Tailscale、ACL 只開需要的埠。                                                                                                                                                                                                  | 實機           |

#### D. 平台（`platforms/`、`synology/`、`pve/`）

| #   | Slug                                 | 標題（草案）                                                  | 優先 | 內容重點                                                                                                                                                         | 驗證                  |
| --- | ------------------------------------ | ------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| D1  | `platforms/asus-merlin`              | 華碩路由器裝 Tailscale：Asuswrt-Merlin + Entware              | P0   | 原廠韌體不行、Merlin 3006+、amtm 裝 Entware、`opkg install tailscale`、開機腳本、kernel vs userspace 模式、Entware 版本過舊的替代方案、DNS 覆寫問題。            | 實機（需一台華碩機）  |
| D2  | `synology/dsm7-outbound-tun`         | DSM 7 讓 NAS 上的其他服務也能連出去：TUN 與 configure-host    | P0   | 預設只能連入、Task Scheduler 開機腳本、套件升級後要重跑、防火牆要放行 `100.64.0.0/10`。                                                                          | 實機                  |
| D3  | `synology/quickconnect-vs-tailscale` | QuickConnect 與 Tailscale：什麼時候用哪一個                   | P0   | 中繼與直連、只限群暉 App vs 全部服務、可並存；Synology Photos／Drive 手機 App 的設定。                                                                           | 實機                  |
| D4  | `platforms/docker`                   | Docker 官方映像檔：環境變數、userspace 與 Serve 設定檔        | P0   | `TS_AUTHKEY`、`TS_USERSPACE`、`TS_SERVE_CONFIG`、state volume、版本釘選；C5 的基礎。                                                                             | 實機                  |
| D5  | `platforms/openwrt`                  | OpenWrt 裝 Tailscale：防火牆 zone、subnet router 與 exit node | P1   | 25.12+ 官方 feed 的 `luci-app-tailscale-community`、專用 zone + masquerade + MSS clamping、`--snat-subnet-routes=false`、不要用舊教學的 `--netfilter-mode=off`。 | 實機                  |
| D6  | `platforms/glinet-travel-router`     | GL.iNet 旅行路由器：整個旅館房間接回家                        | P1   | 內建 Tailscale、exit node 設定、韌體 4.8.1 的已知問題、guest Wi-Fi 不走 Tailscale、按鈕切換腳本。                                                                | 實機                  |
| D7  | `platforms/opnsense-pfsense-unifi`   | OPNsense／pfSense／UniFi 當 subnet router 的限制              | P1   | FreeBSD 沒有 `--snat-subnet-routes=false`、site-to-site 官方要求 Linux、UDM 非官方安裝會被更新打壞；建議用一台 Linux 小機。                                      | 實機（至少 OPNsense） |
| D8  | `platforms/kubernetes-operator`      | k3s 上的 Tailscale operator：Ingress、Connector 與 ProxyGroup | P1   | OAuth client 與 tag、`ingressClassName: tailscale`、`tailscale.com/expose`、Connector 當 subnet router／exit node、L3 ProxyGroup。                               | 實機                  |
| D9  | `platforms/qnap-truenas-unraid`      | QNAP、TrueNAS SCALE、Unraid 的安裝與注意事項                  | P1   | QNAP App Center 官方套件、TrueNAS 非官方 catalog、Unraid plugin；各自的 outbound 限制。                                                                          | 實機（至少 QNAP）     |
| D10 | `platforms/ios-android`              | 手機端設定：iOS VPN On Demand、Android 常駐與電池             | P1   | 離開家用 Wi-Fi 自動連線的規則、exit node 對電池的影響、Android 背景限制。                                                                                        | 實機                  |
| D11 | `platforms/windows-unattended`       | Windows 無人值守模式與當 exit node                            | P1   | `--unattended`、登出後仍連線、Windows 預設接受路由、當 exit node 的設定。                                                                                        | 實機                  |
| D12 | `pve/proxmox-backup-server`          | Proxmox Backup Server 走 Tailscale 做異地備份                 | P1   | 與 C12 分工：這篇只談 PBS 的 remote 與 sync job。                                                                                                                | 實機                  |
| D13 | `platforms/steam-deck`               | Steam Deck 裝 Tailscale                                       | P2   | 社群腳本、系統更新後保留、`--operator=deck --ssh`。                                                                                                              | 實機                  |

#### E. 入門、管理、效能與疑難排解補強

| #   | Slug                                  | 標題（草案）                                               | 優先 | 內容重點                                                                                                                                           | 驗證             |
| --- | ------------------------------------- | ---------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| E1  | `troubleshooting/taiwan-isp-nat`      | 台灣 ISP 與 NAT：中華電信、社區網路、5G 行動網路下的直連率 | P0   | CGNAT 1:16、非固定制免費固定 IP 的申請、IPv6 雙協定、社區網路共用 IP、`tailscale netcheck` 的判讀與各方案對照表、何時該架 peer relay 或自架 DERP。 | 實測（多種線路） |
| E2  | `getting-started/plans`（更新）       | 方案與限制比較（2026 年 4 月 Pricing v4）                  | P0   | Personal Plus 退場、Personal 免費 6 人、裝置數不限、Standard 8 美元、Premium 18 美元、seat 計費、既有客戶保留 12 個月。                            | 以官方定價頁為準 |
| E3  | `use-cases/nextdns-control-d`（更新） | 補充 Tailscale 官方的 Control D DNS 過濾付費方案           | P0   | 與自己接 Control D 的差異、個人方案是否適用。                                                                                                      | 文件整理         |
| E4  | `performance/multiqueue-netmap-cache` | 2026 年的效能升級：multi-queue 與 netmap caching           | P1   | 小封包緩衝、subnet router／exit node 的多通道、控制平面不通時加速啟動；哪個版本才有、怎麼驗證。                                                    | 實測（v1.104+）  |
| E5  | `performance/iperf-methodology`       | 用 iperf3 量 Tailscale 吞吐量的正確方法                    | P1   | 直連與 DERP 分開量、MTU、CPU 瓶頸判讀；給前面兩篇效能文一個共同基準。                                                                              | 實測             |
| E6  | `admin/oauth-clients`                 | OAuth client：給 CI、operator 與雲端 agent 用的憑證        | P1   | 與 auth key 的差異、scope、tag 必填、輪替。A8、A11、D8 都會引用。                                                                                  | 實機             |
| E7  | `admin/gitops-acl`                    | 用 GitHub 管理 policy：gitops-acl-action                   | P2   | 版本控制、PR 審核、測試區塊。                                                                                                                      | 實機             |
| E8  | `troubleshooting/china-travel`        | 中國出差連得回台灣嗎：控制平面、直連與 DERP 三層檢查       | P2   | 只談技術現象與事前檢查清單，語氣保守，不下結論。                                                                                                   | 需實測，否則標註 |
| E9  | `getting-started/headscale`           | Headscale：自架控制平面的代價                              | P2   | 用途、v0.29、功能範圍、什麼人不該用。                                                                                                              | 實機             |

### 4.3 階段規劃

**第一階段（2026 年 10 月至 12 月，15 篇 P0）**

1. `ai/index`（A1）與 `ai/always-on-agent-host`（A2）先上，建立 section。
2. `ai/claude-code-from-phone`（A3）、`ai/openclaw-hermes`（A4）、`ai/local-llm-remote`（A5）。
3. 台灣在地：`troubleshooting/taiwan-isp-nat`（E1）、`platforms/asus-merlin`（D1）、`synology/dsm7-outbound-tun`（D2）、`synology/quickconnect-vs-tailscale`（D3）。
4. homelab 基礎：`use-cases/subnet-router-raspberry-pi`（C4）、`platforms/docker`（D4）、`use-cases/docker-sidecar`（C5）、`use-cases/home-assistant`（C1）、`use-cases/apple-tv-exit-node`（C3）、`use-cases/choosing-remote-access`（C2）。
5. 維護：更新方案比較（E2）、NextDNS／Control D（E3）、`features/serve-identity-headers`（B1，A4 與 A5 會引用，建議一起做）。

**第二階段（2027 年 1 月至 3 月，P1）**

- AI：A6 MCP、A7 skill、A8 cloud sandbox、A9 Aperture、A10 DGX Spark、A11 GitHub Actions；搭配 E6 OAuth client。
- 應用：C6 到 C15；平台：D5 到 D12；功能：B2 Services；效能：E4、E5。

**第三階段（2027 年 4 月起，P2）**

- B3 到 B5、C16 到 C19、D13、E7 到 E9、A12。
- 回頭依 Google Analytics 與 Pagefind 的搜尋字詞調整順序。

每階段結束時重跑一次 `bunx @cloudflare/nimbus-docs check` 與 `bun run lint:docs`，確認 section index 的連結都齊。

### 4.4 寫作與驗證規範（補充 AGENTS.md）

- **版本註記**：新文章一律以當時的穩定版（目前 v1.104）與年月開頭。涉及第三方軟體（OpenClaw、Home Assistant、Open WebUI）時一併註明該軟體版本。
- **官方與社群說法不一致時並陳**，並說明自己的實測結果（延續 Codex Cloud 文的做法）。
- **安全情境一定要給「最小權限」的 grants 範例**，並提醒預設全開規則的問題。AI section 尤其如此。
- **影片引用**：只引用人工核對過的 YouTube 連結，寫法為「影片標題（頻道，年月）」。本文第 3.3 節的清單在引用前要逐一確認。
- **實機驗證**：清單中標「實機」的文章要在動筆前跑過一次；無法驗證的（例如 DGX Spark）在版本註記寫明「依官方文件整理，未實際驗證」。
- **用語**：agent 直接用英文；「AI 代理」在標題與首句可用於解釋。保持 CJK 與英數間的空格（`bun run fix:text`）。
- **OG 字型**：標題避免 Big5 常用字以外的字（例如「喚醒」沒問題，「囧」之類要避免）。

### 4.5 既有文章的維護清單

| 文章                                | 要改什麼                                                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `getting-started/plans`             | Pricing v4（見 E2）。                                                                                                      |
| `use-cases/nextdns-control-d`       | 加入 Tailscale 官方的 Control D 付費方案（見 E3）。                                                                        |
| `features/peer-relay`               | 補 2026 年 2 月 GA 的狀態。                                                                                                |
| `platforms/codex-cloud`             | 加上連到 `ai/index` 與 A8 的連結；MagicDNS 矛盾段落在 A8 完成後回頭更新。                                                  |
| `features/serve`、`features/funnel` | 加「身分標頭」與「OpenClaw／Open WebUI 這類服務怎麼用」的交叉連結。                                                        |
| `performance/index`                 | 加 E4、E5。                                                                                                                |
| `index.mdx`（首頁）                 | 新增「AI 與 agent」區塊；考慮加「依情境找文章」導覽。                                                                      |
| `AGENTS.md`                         | section 清單加入 `ai`（order 0.9）與既有的 `getting-started`、`admin`、`use-cases`、`troubleshooting`（目前只列了 5 個）。 |

### 4.6 可以觀察的指標

- Google Analytics：`ai/` section 上線後的流量佔比、來源（搜尋 vs 社群）。
- Pagefind 搜尋字詞：記錄站內搜尋找不到結果的字詞，作為下一輪題目來源。
- 外部：繁中搜尋「Tailscale + 主題」時 tailscale.tw 的排名（例如「Tailscale Home Assistant」、「Tailscale 華碩」、「Tailscale Claude Code」）。

## 5. 參考來源

### Tailscale 官方

- Codex Cloud shipped with Tailscale support. Nobody told us.（2026-10-06）https://tailscale.com/blog/codex-cloud-tailscale
- Meta Muse 與 Tailscale（2026-09-30）https://tailscale.com/blog/meta-muse-ai-agent-tailscale
- We're making Tailscale faster（2026-09-22）https://tailscale.com/blog/making-tailscale-faster
- DNS filtering by Control D（2026-08-28）https://tailscale.com/blog/dns-filtering-by-control-d
- Tailscale PAM beta（2026-08-27）https://tailscale.com/blog/tailscale-pam-beta
- Aperture GA（2026-08-26）https://tailscale.com/blog/aperture-ga
- The 2026 TailscaleUp-date（2026-08-24）https://tailscale.com/tailscaleup-date-week-26
- Lethal trifecta（2026-08-06）https://tailscale.com/blog/aperture-lethal-trifecta
- Remotely access Home Assistant（2026-07-16 更新）https://tailscale.com/blog/remotely-access-home-assistant
- A no-nonsense explainer to Agentic AI（2026-06-26）https://tailscale.com/blog/agents-are-coming
- Aperture CLI（2026-05-20）https://tailscale.com/blog/aperture-cli-AI-experimentation
- Pricing v4（2026-04-08）https://tailscale.com/blog/pricing-v4
- Winter Update Week 2026 https://tailscale.com/winter-update-week-26
- Tailscale Services（2025-10-28 beta）https://tailscale.com/blog/services-beta 、文件 https://tailscale.com/docs/features/tailscale-services
- Wake-on-LAN with UpSnap（2025-08-19）https://tailscale.com/blog/wake-on-lan-tailscale-upsnap
- Dynamic Client Registration for MCP https://tailscale.com/blog/dynamic-client-registration-dcr-for-mcp-ai
- Secure AI agent connectivity https://tailscale.com/use-cases/secure-ai-agent-connectivity
- Tailscale skill for coding agents https://tailscale.com/docs/features/tailscale-skill 、https://github.com/tailscale/tailscale-skill
- tsidp https://tailscale.com/docs/features/tsidp 、https://github.com/tailscale/tsidp
- Aperture CLI 文件 https://tailscale.com/docs/aperture/cli 、https://github.com/tailscale/aperture-cli
- Tailscale Serve（身分標頭）https://tailscale.com/docs/features/tailscale-serve
- Userspace networking https://tailscale.com/docs/concepts/userspace-networking
- Synology 整合（outbound）https://tailscale.com/docs/integrations/synology
- Apple TV exit node https://tailscale.com/docs/solutions/secure-traffic-public-wifi-appletv
- RustDesk https://tailscale.com/docs/solutions/access-remote-desktops-with-rustdesk 、Windows RDP https://tailscale.com/kb/1095/secure-windows-rdp
- Minecraft https://tailscale.com/docs/solutions/set-up-minecraft 、Share a private game server https://tailscale.com/docs/use-cases/personal-or-at-home-use/share-private-game-server
- GitHub CI/CD https://tailscale.com/docs/solutions/connect-github-cicd-workflows-to-private-infrastructure-without-public-exposure 、GitHub Action https://tailscale.com/kb/1276/tailscale-github-action
- Kubernetes operator https://tailscale.com/kb/1236/kubernetes-operator
- App connectors https://tailscale.com/docs/features/app-connectors
- Taildrive https://tailscale.com/docs/features/taildrive
- SSH session recording https://tailscale.com/docs/features/tailscale-ssh/tailscale-ssh-session-recording
- VPN On Demand https://tailscale.com/kb/1291/ios-vpn-on-demand
- Site-to-site https://tailscale.com/docs/features/site-to-site
- Funnel examples（webhook）https://tailscale.com/docs/reference/examples/funnel
- GL.iNet Beryl AX https://tailscale.com/blog/tailscale-glinet-travel-router-mt3000-beryl-ax
- Sharing https://tailscale.com/blog/tailscale-sharing-friends-family

### AI／agent 社群

- OpenClaw + Tailscale（mager.co，2026-02-22）https://www.mager.co/blog/2026-02-22-openclaw-mac-mini-tailscale/
- OpenClaw 官方 remote access https://docs.openclaw.ai/gateway/tailscale
- OpenClaw 安全事件整理 https://threatcluster.io/cluster/hermes-agent-emerges-amid-openclaws-security-vulnerabilities-21c04cfe
- Hermes Agent 安全設定 https://buttondown.com/witcheer/archive/secure-hermes/
- Remote Claude Code: iPhone + Termius → Mac https://jacktan.bearblog.dev/remote-claude-code/
- Claude Code is better on your phone（harper.blog，2026-01-05）https://harper.blog/2026/01/05/claude-code-is-better-on-your-phone/
- Always-On Claude Code: Remote Control Server on a Mac Mini https://guydevops.com/posts/always-on-claude-code-remote-control-mac-mini/
- Make Mac mini a headless server（Classmethod）https://dev.classmethod.jp/en/articles/reona-herdr-remote-mac-mini/
- Mac Mini Home Server for AI Agents https://hyperbox.sh/blog/mac-mini-home-server-ai-agents
- Claude Code on the web 加入 tailnet 的社群 PR https://github.com/mark-brannan/symphony/pull/8
- claude-code-tailscale（Unraid 容器）https://github.com/msfrox/claude-code-tailscale
- Open WebUI Tailscale https://docs.openwebui.com/tutorials/auth-sso/tailscale 、https://docs.openwebui.com/reference/https/tailscale.md
- Ollama remote access https://www.glukhov.org/llm-hosting/ollama/ollama-remote-access/
- KDnuggets：Accessing Local LLMs Remotely Using Tailscale https://www.kdnuggets.com/accessing-local-llms-remotely-using-tailscale-a-step-by-step-guide
- Tailscale MCP server（Serve 模式說明）https://mcpservers.org/id/servers/HexSleeves/tailscale-mcp
- tailscale-superpowers（社群 skill）https://github.com/cathrynlavery/tailscale-superpowers
- NVIDIA DGX Spark playbook https://build.nvidia.com/spark/tailscale 、精技電腦繁中版 https://www.unitech.com.tw/business-post-detail.aspx?ID=1317
- Tembo Tailscale 整合 https://docs.tembo.io/integrations/tailscale
- AI sandbox 比較（無 Tailscale 支援）https://blog.logrocket.com/comparing-ai-agent-sandbox-platforms-e2b-modal-daytona-and-more/

### Homelab 社群

- ScaleTail（Docker sidecar 範本）https://github.com/tailscale-dev/ScaleTail
- Home Assistant Tailscale add-on 文件 https://github.com/lmagyar/homeassistant-addon-tailscale/blob/main/tailscale/DOCS.md
- Vaultwarden + Tailscale Serve https://vaultwarden.discourse.group/t/guide-vaultwarden-tailscale-serve-and-nothing-else/4309
- Immich mobile backup 文件 https://docs.immich.app/features/mobile-backup
- Mainsail remote access https://docs.mainsail.xyz/overview/quicktips/remote-access
- Sunshine + Moonlight + Tailscale https://dev.to/thevenice/how-i-built-a-free-anydesk-alternative-using-sunshine-moonlight-tailscale-3lh8
- Self-hosting RustDesk on Tailscale https://ianlpaterson.com/blog/rustdesk-self-host-tailscale/
- GL.iNet exit node 問題回報 https://forum.gl-inet.com/t/gl-inet-beryl-ax3000-gl-mt3000-firmware-4-8-1-using-tailscale-in-a-travel-router-home-exit-node-setup-doesnt-work/69543
- OpenWrt Tailscale https://openwrt.org/docs/guide-user/services/vpn/tailscale/start 、luci-app-tailscale-community https://github.com/Tokisaki-Galaxy/luci-app-tailscale-community
- Asuswrt-Merlin Entware 安裝 https://github-wiki-see.page/m/RMerl/asuswrt-merlin.ng/wiki/Installing-Tailscale-through-Entware 、snbforums 教學 https://www.snbforums.com/threads/tailscale-on-merlin.89662/
- UniFi UDM（非官方）https://dev.to/coltonidle/how-to-install-tailscale-on-your-unifi-router-udm-5a35
- pfSense／OPNsense 限制 https://forum.tailscale.com/t/opnsense-with-subnet-router-cant-find-other-nodes/2104
- k3s + Tailscale operator https://dev.to/3sky/again-self-hosting-on-k3s-2bji
- PBS 異地備份（Lawrence Systems 論壇）https://forums.lawrencesystems.com/t/backing-up-vms-and-lxcs-offsite-using-proxmox-backup-server/23130
- Synology 遠端存取五種方式比較（WunderTech）https://www.wundertech.net/synology-nas-remote-access/
- QNAP 安裝 https://nascompares.com/guide/how-to-install-and-setup-tailscale-on-a-qnap-nas/ 、TrueNAS SCALE https://www.wundertech.net/how-to-install-tailscale-on-truenas-scale/
- Tailscale vs Cloudflare Tunnel https://hometechops.com/guides/home-remote-access-tailscale-vs-cloudflare-tunnel
- Headscale 2026 比較 https://simeononsecurity.com/articles/tailscale-vs-headscale-comparison-guide/
- Steam Deck 腳本 https://git.unsupervised.ca/GitHub/deck-tailscale
- Techno Tim 影片（SponsorRadar 索引）https://sponsorradar.com/brands/tailscale
- LearnLinuxTV 入門 https://www.learnlinux.tv/?p=5102 、Homelab Show ep. 64 https://www.learnlinux.tv/the-homelab-show-episode-64-tailscale-and-headscale/
- Talk Python #546 https://talkpython.fm/episodes/show/546/self-hosting-apps-for-python-people

### 台灣在地

- 中華電信 HiNet IPv6 用戶連線參考手冊 https://www.cht.com.tw/home/campaign/Hinet/download/HiNet-IPv6_User_Guide.pdf
- HiNet 光世代免費申請固定 IP（iqmore）https://iqmore.tw/cht-hinet-static-ip
- TWNIC 國內 IASP 支援 IPv6 調查（含 CGNAT 比例）https://ipv6.twnic.tw/promotion-IPv6-Support-Situation.html
- 社區網路外網 IP 受限（香腸炒魷魚）https://sofree.cc/tailscale-vpn/
- Tailscale 完整教學 2026（軟體玩家）https://pcrookie.com/tailscale-free-vpn-remote-access-guide-2026/
- Tailscale 設定教學（Ivon）https://ivonblog.com/posts/setup-tailscale/
- Tailscale 完整教學 2026（most.tw）https://most.tw/posts/blog/tailscale-complete-guide-2026/
- AI Agent 機隊（alphalab）https://www.alphalab.site/tailscale-ai-agent-fleet
- Tailscale + QNAP 跨國協作（CyberQ）https://cyberq.tw/2026/07/26/practical-guide-tailscale-13545/
- Tailscale 在中國能不能用（SSD Nodes 中文版）https://www.ssdnodes.com/learn/lang/zh-hans/does-tailscale-work-in-china

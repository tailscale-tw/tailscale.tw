# 說明
在 [PVE](https://pve.proxmox.com) LXC 容器中安裝使用 [Tailscale](https://tailscale.com/)

## 前言

Tailscale 是一個基於 WireGuard 技術的網路連接工具，可幫助您輕鬆建立安全的私人網絡。而 Proxmox Virtual Environment (PVE) 則是一個強大的開源虛擬化平台，支援 LXC 容器和 KVM 虛擬機。

在 PVE 的 LXC 容器中使用 Tailscale 需要特別設定，因為預設情況下，無特權(unprivileged)的 LXC 容器無法訪問 Tailscale 所需的網路資源。本文將詳細講解如何解決這個問題。

## 背景知識

### LXC 容器簡介

LXC (Linux Containers) 是一種輕量級的虛擬化技術，可讓您在單一主機上運行多個獨立的 Linux 系統，比傳統的虛擬機消耗更少的資源。LXC 容器分為:
- **特權容器**: 容器內的 root 用戶擁有主機系統上的 root 權限
- **無特權容器**: 容器內的 root 用戶在主機系統上被映射為非特權用戶，安全性更高

### Tailscale 工作原理

Tailscale 使用 UDP 封包進行資料傳輸，不需要任何特權操作或核心模組即可建立隧道連接。不過，它確實需要訪問 `/dev/tun` 設備，而無特權的 LXC 容器通常沒有這個權限。

## 在 PVE LXC 容器中啟用 Tailscale 的步驟

### 1. 修改 LXC 容器配置

首先，我們需要修改 LXC 容器的配置文件，以允許容器訪問 `/dev/tun` 設備。

#### 對於 **Proxmox 7.0 及以上**版本，請在 LXC 容器的配置文件中添加以下行：

```
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

例如，假設您的 LXC 容器 ID 為 112，則需要編輯 `/etc/pve/lxc/112.conf` 文件。

#### 對於 **Proxmox 6.x 及更早**版本，請使用以下配置：

```
lxc.cgroup.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

### 2. 重啟 LXC 容器

配置更改後，需要重啟 LXC 容器才能使更改生效。您可以通過 PVE Web 介面或使用命令行重啟：

```bash
pct stop 112
pct start 112
```

### 3. 在 LXC 容器中安裝 Tailscale

現在，您可以在 LXC 容器內安裝 Tailscale package。根據您容器中運行的 Linux 發行版，安裝命令會有所不同。

#### Debian/Ubuntu:

```bash
curl -fsSL https://pkgs.tailscale.com/stable/debian/bullseye.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/debian/bullseye.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt-get update
sudo apt-get install tailscale
```

#### CentOS/RHEL:

```bash
dnf config-manager --add-repo https://pkgs.tailscale.com/stable/centos/8/tailscale.repo
dnf install tailscale
```

### 4. 啟動並配置 Tailscale

安裝完成後，啟動 Tailscale 服務並登入您的 Tailscale 帳戶：

```bash
sudo systemctl enable --now tailscaled
sudo tailscale up
```

執行最後一個命令後，您將獲得一個 URL。訪問該 URL 並登入您的 Tailscale 帳戶以授權此設備。

## 常見問題解答

### 對於較舊的系統（CentOS 7 或 Ubuntu 16.x）

某些舊版本的 Linux 系統在 Proxmox 7.0 中可能仍然無法訪問 `/dev/net/tun`。這是因為這些系統的 systemd 版本太舊，無法認識 `cgroup2`。

Proxmox 提供了解決此問題的[指南](https://pve.proxmox.com/wiki/Upgrade_from_6.x_to_7.0#Old_Container_and_CGroupv2)。

### 使用 user space network 模式

如果您不想授予容器 `/dev/tun` 訪問權限，可以使用 Tailscale 的[user space network 模式](https://tailscale.com/kb/1112/userspace-networking)。這種模式不需要任何管理訪問權限，但性能可能略低。

啟用方法：

```bash
sudo tailscale up --netfilter-mode=off
```

## 結論

通過以上設定，您可以在 Proxmox 虛擬環境的 LXC 容器中成功運行 Tailscale，從而將您的容器安全地連接到您的 Tailscale 網絡。這種配置特別適合於需要在多個虛擬環境中建立安全連接的使用場景，例如家庭實驗室、個人雲服務或分散式開發環境。

Tailscale 與 PVE LXC 容器的結合為網絡管理提供了靈活、安全且易於管理的解決方案，無論您是管理個人的家庭服務器還是企業級的虛擬化環境，都能受益於這種配置。

## 參考文件
* [Tailscale in LXC containers](https://tailscale.com/kb/1130/lxc-unprivileged)